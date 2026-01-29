import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../lib/firebase';
import { doc, setDoc, onSnapshot, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { badges } from '../data/badges';
import { calculateAdaptiveDifficulty } from '../utils/difficultyEngine';
import { checkFatigueStatus, isDeloadComplete } from '../utils/recoveryEngine';
import { checkMilestoneAchieved, strengthMilestones } from '../data/milestones';
import { validateAndMergeData, prepareForCloudSync, compareDataSets } from '../utils/schema';

const STORAGE_KEY = 'lvl-up-fitness-progress';
const DEFAULT_STATE = {
  xp: 0,
  level: 1,
  history: [],
  logs: {},
  customWorkouts: [],
  profile: null,
  unlockedBadges: [],
  badgeUnlocks: {},
  foodLogs: [],
  weightLogs: [],
  photoLogs: [],
  settings: { isPrivacyMode: true },
  // New intelligent features state
  bests: {},                    // Personal bests { exerciseName: maxWeight }
  pendingNotifications: [],     // Adaptive boost / deload notifications
  isDeloadWeek: false,          // Whether user is in recovery mode
  deloadStartDate: null,        // When deload started
  lastDifficultyJump: null,     // When weights were last auto-increased
  // Sync state
  lastSyncSuccess: false,       // Whether last cloud sync was successful
  lastSyncTime: null,           // Timestamp of last successful sync
};

// XP Calculation with PR multiplier
const calculateXP = (totalSets, isPR) => {
  const baseXP = totalSets * 15; // 15 XP per set
  return isPR ? baseXP * 2 : baseXP; // 2x multiplier for PR sessions
};

function getStreakFromHistory(historyArr) {
  if (!historyArr || historyArr.length === 0) return 0;
  const dates = [...new Set(historyArr.map((h) => h.timestamp.split('T')[0]))].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (dates[0] !== today && dates[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const current = new Date(dates[i]);
    const prev = new Date(dates[i + 1]);
    const diffDays = Math.ceil(Math.abs(current - prev) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
}

export default function useProgress() {
  const { user } = useAuth();
  const [state, setState] = useState(DEFAULT_STATE);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. INITIAL LOAD
  useEffect(() => {
    if (!user) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setState({ ...DEFAULT_STATE, ...JSON.parse(stored) });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    console.log("useProgress: User detected, starting cloud sync for:", user.uid);
    setIsCloudSyncing(true);
    const userRef = doc(db, 'users', user.uid);

    // Initial fetch to check/create user document
    getDoc(userRef)
      .then(async (snap) => {
        console.log("useProgress: getDoc completed, exists:", snap.exists());
        if (!snap.exists()) {
          console.log("useProgress: Creating new cloud document");
          const localDataString = localStorage.getItem(STORAGE_KEY);
          const localData = localDataString ? JSON.parse(localDataString) : null;
          const initialData = {
            ...DEFAULT_STATE,
            ...localData,
            profile: {
              ...(localData?.profile || {}),
              name: user.displayName || user.email?.split('@')[0] || 'Athlete',
              email: user.email,
            }
          };
          await setDoc(userRef, initialData);
          console.log("useProgress: Cloud document created");
        } else {
          // Sync profile name if it's "Guest" or missing and we have a displayName
          const cloudData = snap.data();
          console.log("useProgress: Cloud data found, profile name:", cloudData.profile?.name);
          if ((!cloudData.profile?.name || cloudData.profile?.name === 'Guest') && user.displayName) {
            await setDoc(userRef, { 
              profile: { 
                ...(cloudData.profile || {}), 
                name: user.displayName 
              } 
            }, { merge: true });
            console.log("useProgress: Updated Guest name to:", user.displayName);
          }
        }
      })
      .catch((error) => {
        console.error("useProgress: getDoc FAILED:", error.code, error.message);
      });

    console.log("useProgress: Setting up onSnapshot listener");
    const unsubscribe = onSnapshot(
      userRef, 
      (docSnap) => {
        console.log("useProgress: onSnapshot fired, exists:", docSnap.exists());
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("useProgress: Cloud data received - Name:", data?.profile?.name, "Level:", data?.level, "XP:", data?.xp);
          setState({ ...DEFAULT_STATE, ...data });
        } else {
          console.log("useProgress: No cloud data found for user");
        }
        setIsCloudSyncing(false);
        setIsLoading(false);
      },
      (error) => {
        console.error("useProgress: onSnapshot ERROR:", error.code, error.message);
        setIsCloudSyncing(false);
        setIsLoading(false);
        // Fall back to localStorage on error
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) setState({ ...DEFAULT_STATE, ...JSON.parse(stored) });
        } catch (e) {
          console.error("LocalStorage fallback failed:", e);
        }
      }
    );
    return () => unsubscribe();
  }, [user]);

  // 2. SAVE HELPER - Atomic Sync with status tracking
  const saveProgress = useCallback(async (newState) => {
    // Always update local state immediately
    setState(prev => ({
      ...newState,
      lastSyncSuccess: prev.lastSyncSuccess,
      lastSyncTime: prev.lastSyncTime,
    }));

    if (user) {
      try {
        // Prepare data for cloud (handle photo size limits)
        const cloudData = prepareForCloudSync(newState);
        
        // 1. Atomic sync - save full private data with merge: true
        await setDoc(doc(db, 'users', user.uid), {
          ...cloudData,
          lastSync: serverTimestamp(),
        }, { merge: true });

        // 2. Save public "Score" data for the leaderboard
        await setDoc(doc(db, 'leaderboard', user.uid), {
          username: user.displayName || user.email?.split('@')[0] || 'Anonymous',
          xp: newState.xp,
          level: newState.level,
          lastActive: new Date().toISOString(),
        }, { merge: true });

        // Update sync status on success
        setState(prev => ({
          ...prev,
          lastSyncSuccess: true,
          lastSyncTime: new Date().toISOString(),
        }));

        console.log("Mission Data Synced Successfully.");
      } catch (error) {
        console.error("Sync Failure:", error);
        // Mark sync as failed but keep data locally
        setState(prev => ({
          ...prev,
          lastSyncSuccess: false,
        }));
        // Also save to localStorage as backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      }
    } else {
      // Save to LocalStorage for guest users
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    }
  }, [user]);

  // 3. CORE ACTIONS (with badge checks, intelligent features, and PR detection)
  const completeWorkout = useCallback(
    (workoutId, duration, mood = null, sessionData = null) => {
      let detectedPRs = []; // Track PRs for celebration

      setState((prev) => {
        // Check if deload period should end
        let isDeloadWeek = prev.isDeloadWeek;
        let deloadStartDate = prev.deloadStartDate;
        if (isDeloadWeek && isDeloadComplete(deloadStartDate)) {
          isDeloadWeek = false;
          deloadStartDate = null;
        }

        // Process mood-based intelligence
        let pendingNotifications = [...(prev.pendingNotifications || [])];
        let bests = { ...(prev.bests || {}) };
        let lastDifficultyJump = prev.lastDifficultyJump;
        let sessionPRs = []; // PRs achieved in this session

        // Update personal bests from session data and detect PRs
        if (sessionData) {
          Object.entries(sessionData).forEach(([index, sets]) => {
            const exerciseName = sessionData.exercises?.[index]?.name;
            if (exerciseName && Array.isArray(sets) && sets.length > 0) {
              const maxWeight = Math.max(...sets.map(s => parseFloat(s.weight || 0)), 0);
              
              if (maxWeight > 0) {
                const currentBest = bests[exerciseName] || 0;
                if (maxWeight > currentBest) {
                  // PR DETECTED!
                  const prData = {
                    exercise: exerciseName,
                    value: maxWeight,
                    previousBest: currentBest,
                    unit: 'LBS',
                    timestamp: new Date().toISOString(),
                  };
                  sessionPRs.push(prData);
                  
                  // Check for milestone achievement
                  const milestone = checkMilestoneAchieved(exerciseName, currentBest, maxWeight);
                  if (milestone) {
                    pendingNotifications.push({
                      type: 'milestone',
                      title: `${milestone.rank.toUpperCase()} ACHIEVED`,
                      message: `You hit ${milestone.value} ${milestone.unit} on ${exerciseName}! ${milestone.reward} unlocked.`
                    });
                  }
                  bests[exerciseName] = maxWeight;
                }
              }
            }
          });
        }

        // Store PRs for external access
        detectedPRs = sessionPRs;

        // Calculate total sets for XP
        const totalSets = sessionData 
          ? Object.values(sessionData).flat().filter(s => s?.completed).length 
          : Math.ceil(duration / 5); // Fallback: estimate 5 min per set

        // Apply 2x XP multiplier if PR was achieved
        const hasPR = sessionPRs.length > 0;
        const earnedXP = calculateXP(totalSets, hasPR);
        const newXp = prev.xp + earnedXP;
        const newLevel = Math.floor(newXp / 500) + 1;
        
        // Calculate session stats for badge checking
        const totalReps = sessionData 
          ? Object.values(sessionData).flat().reduce((sum, s) => sum + (parseInt(s.reps) || 0), 0)
          : 0;
        const totalVolume = sessionData
          ? Object.values(sessionData).flat().reduce((sum, s) => sum + ((parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0)), 0)
          : 0;

        const newEntry = {
          workoutId,
          duration,
          timestamp: new Date().toISOString(),
          xpEarned: earnedXP,
          mood, // 'easy', 'perfect', or 'brutal'
          prs: sessionPRs, // Include PRs in history
          hadPRBonus: hasPR,
          totalReps,
          totalVolume,
        };
        const newHistory = [newEntry, ...(prev.history || [])];
        const computedStreak = getStreakFromHistory(newHistory);

        // Check for fatigue (CNS overload) - 3 brutal sessions
        if (mood) {
          const { shouldDeload } = checkFatigueStatus(newHistory);
          if (shouldDeload && !isDeloadWeek) {
            isDeloadWeek = true;
            deloadStartDate = new Date().toISOString();
            pendingNotifications = [{
              type: 'recovery',
              title: 'DE-LOAD INITIATED',
              message: "You've been redlining. I've halved your weight targets for the next 7 days to allow for structural repair."
            }];
          }

          // Check for adaptive difficulty boost (2 consecutive easy)
          if (!isDeloadWeek) {
            const { shouldUpdate, newTargets, message: boostMsg } = calculateAdaptiveDifficulty(newHistory, bests);
            if (shouldUpdate) {
              bests = newTargets;
              lastDifficultyJump = new Date().toISOString();
              pendingNotifications = [{
                type: 'upgrade',
                title: 'ADAPTIVE BOOST',
                message: boostMsg
              }];
            }
          }
        }

        // Add PR notification if we had PRs
        if (hasPR) {
          pendingNotifications.push({
            type: 'pr',
            title: 'PERSONAL RECORD!',
            message: `You crushed ${sessionPRs.length} PR${sessionPRs.length > 1 ? 's' : ''}! 2x XP bonus applied.`,
            prs: sessionPRs,
          });
        }

        const intermediateState = {
          ...prev,
          xp: newXp,
          level: newLevel,
          history: newHistory,
          streak: computedStreak,
          bests,
          pendingNotifications,
          isDeloadWeek,
          deloadStartDate,
          lastDifficultyJump,
        };

        const currentBadges = prev.unlockedBadges || [];
        const currentBadgeUnlocks = prev.badgeUnlocks || {};
        const newBadges = badges
          .filter((b) => !currentBadges.includes(b.id) && b.check(intermediateState, newEntry))
          .map((b) => b.id);

        const now = new Date().toISOString();
        const updatedBadgeUnlocks = { ...currentBadgeUnlocks };
        newBadges.forEach((badgeId) => {
          updatedBadgeUnlocks[badgeId] = now;
        });

        const finalState = {
          ...intermediateState,
          unlockedBadges: [...currentBadges, ...newBadges],
          badgeUnlocks: updatedBadgeUnlocks,
        };

        saveProgress(finalState);
        if (newBadges.length > 0) {
          console.log('Unlocked badges:', newBadges);
        }
        return finalState;
      });

      // Return detected PRs for celebration UI
      return detectedPRs;
    },
    [saveProgress]
  );

  const resetProgress = useCallback(() => {
    if (confirm("Are you sure? This nukes everything.")) {
      saveProgress(DEFAULT_STATE);
    }
  }, [saveProgress]);

  // 4. LOG EXERCISE SETS (or legacy single weight)
  // setsData = [ { weight: 135, reps: 10, completed: true }, ... ]
  // Keeps Stats working: weight = max weight from session; sets = full detail.
  const saveExerciseLog = useCallback((exerciseName, weightOrSets, unit = 'lbs') => {
    const currentLogs = state.logs || {};
    const exerciseHistory = currentLogs[exerciseName] || [];

    let newLog;
    if (Array.isArray(weightOrSets)) {
      const setsData = weightOrSets;
      const maxWeight = setsData.length
        ? Math.max(...setsData.map((s) => parseFloat(s.weight || 0)), 0)
        : 0;
      newLog = {
        date: new Date().toISOString(),
        weight: maxWeight,
        unit,
        sets: setsData,
      };
    } else {
      // Legacy: single weight (string or number)
      newLog = {
        date: new Date().toISOString(),
        weight: parseFloat(weightOrSets) || 0,
        unit,
      };
    }

    const newHistory = [newLog, ...exerciseHistory].slice(0, 10);
    const newState = {
      ...state,
      logs: { ...currentLogs, [exerciseName]: newHistory },
    };
    saveProgress(newState);
  }, [state, saveProgress]);

  // 5. HELPER: GET LAST LOG ENTRY
  const getLastLog = useCallback((exerciseName) => {
    if (!state.logs || !state.logs[exerciseName] || state.logs[exerciseName].length === 0) return null;
    return state.logs[exerciseName][0];
  }, [state.logs]);

  // 6. SAVE / DELETE CUSTOM WORKOUT
  const saveCustomWorkout = useCallback((workout) => {
    const newWorkouts = [...(state.customWorkouts || []), workout];
    const newState = { ...state, customWorkouts: newWorkouts };
    saveProgress(newState);
  }, [state, saveProgress]);

  const deleteCustomWorkout = useCallback((workoutId) => {
    const newWorkouts = (state.customWorkouts || []).filter((w) => w.id !== workoutId);
    const newState = { ...state, customWorkouts: newWorkouts };
    saveProgress(newState);
  }, [state, saveProgress]);

  // 7. SAVE USER PROFILE (ONBOARDING)
  const saveUserProfile = useCallback((profileData) => {
    setState((prev) => {
      const newState = { ...prev, profile: profileData };
      saveProgress(newState);
      return newState;
    });
  }, [saveProgress]);

  // 8. UPDATE PROFILE (merge updates)
  const updateProfile = useCallback((updates) => {
    setState((prev) => {
      const newState = {
        ...prev,
        profile: { ...(prev.profile || {}), ...updates },
      };
      saveProgress(newState);
      return newState;
    });
  }, [saveProgress]);

  // 9. UPLOAD PROFILE PHOTO
  const uploadProfilePhoto = useCallback(async (file) => {
    if (!user) {
      // For guest users, convert to data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result;
          updateProfile({ photoURL: dataUrl });
          resolve(dataUrl);
        };
        reader.readAsDataURL(file);
      });
    }

    try {
      const photoRef = ref(storage, `profile-photos/${user.uid}/${Date.now()}`);
      await uploadBytes(photoRef, file);
      const downloadURL = await getDownloadURL(photoRef);
      updateProfile({ photoURL: downloadURL });
      return downloadURL;
    } catch (error) {
      console.error('Photo upload failed:', error);
      throw error;
    }
  }, [user, updateProfile]);

  // 10. LOG FOOD
  const logFood = useCallback((foodItem) => {
    setState((prev) => {
      let protein = null;
      if (typeof foodItem.protein === 'number' && !Number.isNaN(foodItem.protein)) {
        protein = foodItem.protein;
      } else if (typeof foodItem.protein === 'string') {
        const parsed = parseFloat(String(foodItem.protein).replace(/[^\d.]/g, ''));
        protein = Number.isNaN(parsed) ? null : parsed;
      }

      const newLog = {
        id: Date.now(),
        item: foodItem.title || foodItem.name,
        type: foodItem.type || 'powerfood',
        timestamp: new Date().toISOString(),
        calories: foodItem.calories != null ? Number(foodItem.calories) : null,
        protein,
      };

      const newState = {
        ...prev,
        foodLogs: [newLog, ...(prev.foodLogs || [])].slice(0, 50),
      };

      saveProgress(newState);
      return newState;
    });
  }, [saveProgress]);

  // 11. UPDATE PROTEIN GOAL
  const updateGoal = useCallback(
    (newGoal) => {
      updateProfile({ dailyProteinGoal: parseInt(newGoal, 10) || 150 });
    },
    [updateProfile]
  );

  // 12. LOG WEIGHT
  const logWeight = useCallback(
    (val) => {
      const value = parseFloat(val);
      if (Number.isNaN(value)) return;
      const dateStr = new Date().toISOString().split('T')[0];
      setState((prev) => {
        const newLog = { date: dateStr, value };
        const filtered = (prev.weightLogs || []).filter((l) => l.date !== dateStr);
        const newState = {
          ...prev,
          profile: { ...(prev.profile || {}), weight: value, unit: prev.profile?.unit || 'lbs' },
          weightLogs: [newLog, ...filtered].slice(0, 30),
        };
        saveProgress(newState);
        return newState;
      });
    },
    [saveProgress]
  );

  // 13. SAVE PROGRESS PHOTO
  const savePhoto = useCallback(
    (photoData, side) => {
      setState((prev) => {
        const newEntry = {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          side,
          url: photoData,
        };
        const newState = {
          ...prev,
          photoLogs: [newEntry, ...(prev.photoLogs || [])],
        };
        saveProgress(newState);
        return newState;
      });
    },
    [saveProgress]
  );

  // 14. DELETE PROGRESS PHOTO
  const deletePhoto = useCallback(
    (id) => {
      setState((prev) => {
        const newState = {
          ...prev,
          photoLogs: (prev.photoLogs || []).filter((p) => p.id !== id),
        };
        saveProgress(newState);
        return newState;
      });
    },
    [saveProgress]
  );

  // 15. TOGGLE PRIVACY MODE
  const togglePrivacy = useCallback(() => {
    setState((prev) => {
      const next = !(prev.settings?.isPrivacyMode ?? true);
      const newState = {
        ...prev,
        settings: { ...(prev.settings || {}), isPrivacyMode: next },
      };
      saveProgress(newState);
      return newState;
    });
  }, [saveProgress]);

  // 16. STREAK CALC (uses shared helper)
  const calculateStreak = () => getStreakFromHistory(state.history || []);

  // 17. CLEAR NOTIFICATION
  const clearNotification = useCallback((index) => {
    setState((prev) => {
      const notifications = [...(prev.pendingNotifications || [])];
      notifications.splice(index, 1);
      const newState = { ...prev, pendingNotifications: notifications };
      saveProgress(newState);
      return newState;
    });
  }, [saveProgress]);

  // 18. CLEAR ALL NOTIFICATIONS
  const clearAllNotifications = useCallback(() => {
    setState((prev) => {
      const newState = { ...prev, pendingNotifications: [] };
      saveProgress(newState);
      return newState;
    });
  }, [saveProgress]);

  // 19. GET USER BEST FOR AN EXERCISE
  const getUserBest = useCallback((exerciseName) => {
    // Check bests object first
    if (state.bests?.[exerciseName]) {
      return state.bests[exerciseName];
    }
    // Fallback: scan logs for max weight
    const exerciseLogs = state.logs?.[exerciseName] || [];
    if (exerciseLogs.length === 0) return 0;
    
    const maxWeight = Math.max(
      ...exerciseLogs.map(log => {
        if (log.sets) {
          return Math.max(...log.sets.map(s => parseFloat(s.weight || 0)), 0);
        }
        return parseFloat(log.weight || 0);
      }),
      0
    );
    return maxWeight;
  }, [state.bests, state.logs]);

  // 20. UPDATE BESTS MANUALLY
  const updateBests = useCallback((newBests) => {
    setState((prev) => {
      const newState = {
        ...prev,
        bests: { ...(prev.bests || {}), ...newBests }
      };
      saveProgress(newState);
      return newState;
    });
  }, [saveProgress]);

  // 21. SMART MERGE - For Guest-to-Cloud migration
  const performSmartMerge = useCallback(async (cloudData) => {
    const comparison = compareDataSets(state, cloudData);
    
    if (comparison.localIsAhead) {
      // Local progress is higher - offer to upload
      const confirmOverwrite = window.confirm(
        `Your local progress (${comparison.localScore} points) is higher than your cloud save (${comparison.cloudScore} points). Sync local to cloud?`
      );
      if (confirmOverwrite) {
        await saveProgress(state);
        return 'uploaded';
      } else {
        // Download cloud data instead
        const mergedData = validateAndMergeData(cloudData);
        setState(mergedData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
        return 'downloaded';
      }
    } else if (comparison.cloudIsAhead) {
      // Cloud is ahead - download it
      const mergedData = validateAndMergeData(cloudData);
      setState(mergedData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
      return 'downloaded';
    } else {
      // Equal - keep cloud version
      const mergedData = validateAndMergeData(cloudData);
      setState(mergedData);
      return 'synced';
    }
  }, [state, saveProgress]);

  // 22. GET LAST SESSION PRs (for celebration UI)
  const getLastSessionPRs = useCallback(() => {
    const lastWorkout = state.history?.[0];
    if (lastWorkout?.prs && lastWorkout.prs.length > 0) {
      return {
        prs: lastWorkout.prs,
        xpEarned: lastWorkout.xpEarned,
        hadPRBonus: lastWorkout.hadPRBonus,
      };
    }
    return null;
  }, [state.history]);

  // 23. CHECK IF SPECIFIC WEIGHT IS A PR
  const wouldBePR = useCallback((exerciseName, weight) => {
    const currentBest = state.bests?.[exerciseName] || 0;
    return weight > currentBest;
  }, [state.bests]);

  // 24. FORCE SYNC - Manual pull from cloud
  const forceSync = useCallback(async () => {
    if (!user) {
      console.log("Force sync: No user logged in");
      return false;
    }
    
    setIsCloudSyncing(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      
      if (snap.exists()) {
        const cloudData = snap.data();
        console.log("Force sync: Cloud data retrieved", cloudData?.profile?.name);
        setState({ ...DEFAULT_STATE, ...cloudData });
        // Also update localStorage with cloud data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
        setIsCloudSyncing(false);
        return true;
      } else {
        console.log("Force sync: No cloud data exists");
        setIsCloudSyncing(false);
        return false;
      }
    } catch (error) {
      console.error("Force sync failed:", error);
      setIsCloudSyncing(false);
      return false;
    }
  }, [user]);

  return {
    ...state,
    streak: calculateStreak(),
    isLoading,
    completeWorkout,
    resetProgress,
    saveExerciseLog,
    getLastLog,
    saveCustomWorkout,
    deleteCustomWorkout,
    saveUserProfile,
    updateProfile,
    uploadProfilePhoto,
    logFood,
    updateGoal,
    logWeight,
    savePhoto,
    deletePhoto,
    togglePrivacy,
    isCloudSyncing,
    // New intelligent features
    clearNotification,
    clearAllNotifications,
    getUserBest,
    updateBests,
    // PR and Sync features
    performSmartMerge,
    getLastSessionPRs,
    wouldBePR,
    forceSync,
  };
}
