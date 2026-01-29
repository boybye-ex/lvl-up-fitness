/**
 * Master Sync Schema for STRIVE 15
 * 
 * This defines the complete data structure for user progress.
 * Used to ensure consistent syncing between local storage and Firebase.
 */

export const masterSyncSchema = {
  // User Profile
  profile: {
    name: null,           // Display name
    age: 30,              // For heart rate calculations
    weight: null,         // Current body weight
    unit: 'lbs',          // Weight unit preference
    dailyProteinGoal: 150, // Nutrition target
    photoURL: null,       // Profile photo
    lifestyle: null,      // Selected lifestyle from onboarding
    fitnessGoal: null,    // Primary fitness goal
  },

  // XP & Leveling System
  xp: 0,
  level: 1,

  // Personal Bests (PRs)
  bests: {},              // { exerciseName: maxWeight }

  // Workout History
  history: [],            // Array of { workoutId, duration, timestamp, xpEarned, mood, prs: [] }

  // Exercise Logs (Per-Exercise Tracking)
  logs: {},               // { exerciseName: [{ date, weight, unit, sets: [] }] }

  // Custom Workouts
  customWorkouts: [],     // User-created workout routines

  // Badges & Achievements
  unlockedBadges: [],     // Array of badge IDs
  badgeUnlocks: {},       // { badgeId: unlockTimestamp }

  // Nutrition Tracking
  foodLogs: [],           // [{ id, item, type, timestamp, calories, protein }]

  // Body Composition
  weightLogs: [],         // [{ date, value }]
  photoLogs: [],          // [{ id, date, side, url }] - Progress photos

  // App Settings
  settings: {
    isPrivacyMode: true,  // Privacy toggle for photos
    soundEnabled: true,   // Audio feedback
    hapticsEnabled: true, // Vibration feedback
    unit: 'lbs',          // Default weight unit
  },

  // Intelligent Training Features
  pendingNotifications: [], // Adaptive boost / deload notifications
  isDeloadWeek: false,      // Whether user is in recovery mode
  deloadStartDate: null,    // When deload started
  lastDifficultyJump: null, // When weights were last auto-increased

  // Sync Metadata
  lastSync: null,           // Last successful sync timestamp
  syncVersion: 1,           // Schema version for migrations
};

/**
 * Validates and merges incoming data with the master schema.
 * Ensures all required fields exist with proper defaults.
 */
export function validateAndMergeData(incomingData) {
  if (!incomingData) return { ...masterSyncSchema };

  const merged = { ...masterSyncSchema };

  // Deep merge profile
  if (incomingData.profile) {
    merged.profile = { ...masterSyncSchema.profile, ...incomingData.profile };
  }

  // Deep merge settings
  if (incomingData.settings) {
    merged.settings = { ...masterSyncSchema.settings, ...incomingData.settings };
  }

  // Merge primitive fields
  const primitiveFields = [
    'xp', 'level', 'isDeloadWeek', 'deloadStartDate', 
    'lastDifficultyJump', 'lastSync', 'syncVersion'
  ];
  primitiveFields.forEach(field => {
    if (incomingData[field] !== undefined) {
      merged[field] = incomingData[field];
    }
  });

  // Merge object fields
  const objectFields = ['bests', 'logs', 'badgeUnlocks'];
  objectFields.forEach(field => {
    if (incomingData[field] && typeof incomingData[field] === 'object') {
      merged[field] = { ...incomingData[field] };
    }
  });

  // Merge array fields (ensure they're arrays)
  const arrayFields = [
    'history', 'customWorkouts', 'unlockedBadges', 
    'foodLogs', 'weightLogs', 'photoLogs', 'pendingNotifications'
  ];
  arrayFields.forEach(field => {
    if (Array.isArray(incomingData[field])) {
      merged[field] = [...incomingData[field]];
    }
  });

  return merged;
}

/**
 * Prepares data for cloud sync.
 * Handles photo size limits and removes sensitive data.
 */
export function prepareForCloudSync(localData) {
  const syncData = { ...localData };

  // Photo Size Optimization: Only sync the last 5 photos to stay under Firestore's 1MB limit
  if (syncData.photoLogs && syncData.photoLogs.length > 5) {
    // Keep metadata for all photos, but only sync Base64 for recent ones
    syncData.photoLogs = syncData.photoLogs.slice(0, 5);
  }

  // Clean up any undefined values that Firestore doesn't like
  Object.keys(syncData).forEach(key => {
    if (syncData[key] === undefined) {
      delete syncData[key];
    }
  });

  return syncData;
}

/**
 * Compare local vs cloud data to determine which is "newer" or "better"
 * Used for the "Smart Merge" on first Google login
 */
export function compareDataSets(localData, cloudData) {
  const localXP = localData?.xp || 0;
  const cloudXP = cloudData?.xp || 0;
  const localWorkouts = localData?.history?.length || 0;
  const cloudWorkouts = cloudData?.history?.length || 0;

  // Calculate a "progress score" based on multiple factors
  const localScore = localXP + (localWorkouts * 100);
  const cloudScore = cloudXP + (cloudWorkouts * 100);

  return {
    localIsAhead: localScore > cloudScore,
    cloudIsAhead: cloudScore > localScore,
    areEqual: localScore === cloudScore,
    localScore,
    cloudScore,
    recommendation: localScore > cloudScore ? 'upload' : cloudScore > localScore ? 'download' : 'keep_both',
  };
}

export default masterSyncSchema;
