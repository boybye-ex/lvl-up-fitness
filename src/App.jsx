import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import WorkoutView from './components/WorkoutView';
import CreateView from './components/CreateView';
import LeaderboardView from './components/LeaderboardView';
import NutritionView from './components/NutritionView';
import HistoryView from './components/HistoryView';
import StealthView from './components/StealthView';
import RecoveryView from './components/RecoveryView';
import ProfileView from './components/ProfileView';
import SkillTreeView from './components/SkillTreeView';
import StatsView from './components/StatsView';
import OnboardingView from './components/OnboardingView';
import WorkoutSuccess from './components/WorkoutSuccess';
import PRCelebration from './components/PRCelebration';
import DailyTip from './components/DailyTip';
import WorkoutDetail from './components/WorkoutDetail';
import AchievementToast from './components/AchievementToast';
import Layout from './components/Layout';
import useProgress from './hooks/useProgress';
import { badges } from './data/badges';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  const {
    xp,
    level,
    history,
    streak,
    logs,
    customWorkouts,
    profile,
    unlockedBadges,
    badgeUnlocks,
    isLoading,
    completeWorkout,
    resetProgress,
    saveCustomWorkout,
    deleteCustomWorkout,
    saveUserProfile,
    // New intelligent features
    foodLogs,
    pendingNotifications,
    clearNotification,
    bests,
    isDeloadWeek,
  } = useProgress();

  // State: 'dashboard', 'preview', 'workout', 'nutrition', 'history', 'stealth', 'recovery', 'profile', 'skills', 'leaderboard', 'onboarding', 'success', 'pr-celebration'
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [previewWorkout, setPreviewWorkout] = useState(null);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [earnedXp, setEarnedXp] = useState(0);
  const [sessionPRs, setSessionPRs] = useState(null); // PRs achieved in last workout
  const [newBadge, setNewBadge] = useState(null);

  // Track new badges for toast
  useEffect(() => {
    if (unlockedBadges.length > 0) {
      const lastBadgeId = unlockedBadges[unlockedBadges.length - 1];
      const unlockTime = badgeUnlocks[lastBadgeId];
      
      // If unlocked in the last 10 seconds, show toast
      if (unlockTime && (Date.now() - new Date(unlockTime).getTime()) < 10000) {
        const badge = badges.find(b => b.id === lastBadgeId);
        if (badge) setNewBadge(badge);
      }
    }
  }, [unlockedBadges, badgeUnlocks]);

  // Route by profile/onboarding only after progress has loaded
  useEffect(() => {
    if (!isLoading) {
      if (!profile && currentView !== 'onboarding') {
        setCurrentView('onboarding');
      }
      if (profile && currentView === 'onboarding') {
        setCurrentView('dashboard');
      }
    }
  }, [isLoading, profile, currentView]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-500 font-black italic tracking-tighter animate-pulse">
          LOADING PROFILE...
        </div>
      </div>
    );
  }

  const handleStartWorkout = (workout) => {
    setActiveWorkout(workout);
    setCurrentView('workout');
    window.scrollTo(0, 0);
  };

  const handleCompleteWorkout = (workout, mood = null, sessionData = null) => {
    // completeWorkout now returns detected PRs
    const detectedPRs = completeWorkout(workout.id, workout.duration, mood, { ...sessionData, exercises: workout.exercises });
    
    // Calculate total sets for proper XP display
    const totalSets = sessionData 
      ? Object.values(sessionData).flat().filter(s => s?.completed).length 
      : Math.ceil(workout.duration / 5);
    
    // Calculate XP with potential PR bonus
    const hasPR = detectedPRs && detectedPRs.length > 0;
    const baseXP = totalSets * 15;
    const xpGained = hasPR ? baseXP * 2 : baseXP;
    
    setActiveWorkout(null);
    setEarnedXp(xpGained);
    setCurrentWorkout(workout);
    
    // If PRs were detected, show celebration first
    if (hasPR) {
      setSessionPRs(detectedPRs);
      setCurrentView('pr-celebration');
    } else {
      setCurrentView('success');
    }
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'preview':
        return (
          <WorkoutDetail
            workout={previewWorkout}
            onBack={() => {
              setPreviewWorkout(null);
              setCurrentView('dashboard');
            }}
            onStart={(w) => {
              handleStartWorkout(w);
              setPreviewWorkout(null);
            }}
          />
        );
      case 'workout':
        return (
          <WorkoutView
            workout={activeWorkout}
            onBack={() => setCurrentView('dashboard')}
            onComplete={handleCompleteWorkout}
            onStartRecovery={() => {
              handleCompleteWorkout(activeWorkout);
              setCurrentView('recovery');
              window.scrollTo(0, 0);
            }}
          />
        );
      case 'create':
        return (
          <CreateView
            onBack={() => setCurrentView('dashboard')}
            onSave={(w) => {
              saveCustomWorkout(w);
              setCurrentView('dashboard');
            }}
          />
        );
      case 'leaderboard':
        return (
          <LeaderboardView
            onBack={() => setCurrentView('profile')}
            currentUserId={user?.uid}
          />
        );
      case 'nutrition':
        return <NutritionView onBack={() => setCurrentView('dashboard')} />;
      case 'history':
        return <HistoryView history={history} streak={streak} onBack={() => setCurrentView('dashboard')} />;
      case 'stealth':
        return <StealthView onBack={() => setCurrentView('dashboard')} onComplete={handleCompleteWorkout} />;
      case 'recovery':
        return <RecoveryView onBack={() => setCurrentView('dashboard')} />;
      case 'pr-celebration':
        return (
          <PRCelebration
            prData={sessionPRs?.[0] || { exercise: 'Exercise', value: 0 }}
            userLevel={level}
            xpBonus={earnedXp}
            onContinue={() => {
              setSessionPRs(null);
              setCurrentView('success');
            }}
            onClose={() => {
              setSessionPRs(null);
              setCurrentView('success');
            }}
          />
        );
      case 'success':
        return (
          <WorkoutSuccess
            workout={currentWorkout}
            xpEarned={earnedXp}
            onStartRecovery={() => setCurrentView('recovery')}
            onFinish={() => setCurrentView('dashboard')}
          />
        );
      case 'profile':
        return (
          <ProfileView
            onBack={() => setCurrentView('dashboard')}
            onReset={resetProgress}
            unlockedBadges={unlockedBadges}
            level={level}
            onChangeView={setCurrentView}
          />
        );
      case 'skills':
        return <SkillTreeView xp={xp} onBack={() => setCurrentView('dashboard')} />;
      case 'stats':
        return (
          <StatsView
            history={history}
            logs={logs}
            onBack={() => setCurrentView('profile')}
          />
        );
      case 'onboarding':
        return (
          <OnboardingView
            onComplete={(p) => {
              saveUserProfile(p);
              setCurrentView('dashboard');
            }}
          />
        );
      default:
        return (
          <>
            <Dashboard
              xp={xp}
              level={level}
              streak={streak}
              profile={profile}
              customWorkouts={customWorkouts}
              onSelectWorkout={(workout) => {
                setPreviewWorkout(workout);
                setCurrentView('preview');
              }}
              onShowCreate={() => setCurrentView('create')}
              onShowLeaderboard={() => setCurrentView('leaderboard')}
              onDeleteCustomWorkout={deleteCustomWorkout}
              // New intelligent features props
              history={history}
              foodLogs={foodLogs}
              pendingNotifications={pendingNotifications}
              onClearNotification={clearNotification}
              onViewStats={() => setCurrentView('stats')}
              bests={bests}
            />
            <div className="max-w-md mx-auto px-6 pb-6">
              <DailyTip />
            </div>
          </>
        );
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderView()}
      <AchievementToast badge={newBadge} onClear={() => setNewBadge(null)} />
    </Layout>
  );
}

export default App;
