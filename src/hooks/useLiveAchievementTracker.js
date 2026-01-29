import { useState, useEffect } from 'react';

/**
 * Live Achievement Tracker Hook
 * Monitors current workout session for proximity to achievements
 */
export const useLiveAchievementTracker = (sessionData, unlockedBadges = []) => {
  const [activeToast, setActiveToast] = useState(null);

  useEffect(() => {
    if (!sessionData) return;

    // Calculate live stats
    const sets = Object.values(sessionData).flat();
    const totalReps = sets.reduce((sum, s) => sum + (parseInt(s.reps) || 0), 0);
    const totalVolume = sets.reduce((sum, s) => sum + ((parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0)), 0);

    // 1. Century Club Proximity (100 Reps)
    if (!unlockedBadges.includes('century_club')) {
      const remaining = 100 - totalReps;
      if (remaining > 0 && remaining <= 15 && totalReps > 50 && totalReps % 5 === 0) {
        setActiveToast({
          id: 'century_club_proximity',
          message: `${remaining} reps until 'Century Club'`,
          icon: '💯',
          type: 'intel'
        });
      }
    }

    // 2. Volume King Proximity (5000 lbs)
    if (!unlockedBadges.includes('volume_king')) {
      const remaining = 5000 - totalVolume;
      if (remaining > 0 && remaining <= 500 && totalVolume > 3000 && Math.floor(totalVolume / 100) % 5 === 0) {
        setActiveToast({
          id: 'volume_king_proximity',
          message: `${Math.round(remaining)} lbs until 'Volume King'`,
          icon: '👑',
          type: 'intel'
        });
      }
    }

    // Auto-clear toast after 4 seconds
    if (activeToast) {
      const timer = setTimeout(() => setActiveToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [sessionData, unlockedBadges]);

  return { activeToast, clearToast: () => setActiveToast(null) };
};

export default useLiveAchievementTracker;
