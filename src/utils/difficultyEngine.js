/**
 * Adaptive Difficulty Engine
 * Implements Progressive Overload by analyzing mood patterns.
 * If workouts feel "easy" consistently, the app auto-increases targets.
 */

/**
 * Check if the user is ready for increased difficulty
 * @param {Array} history - Workout history with mood data
 * @param {Object} currentBests - Current personal bests { exerciseName: weight }
 * @returns {Object} { shouldUpdate: boolean, newTargets: Object, message: string }
 */
export function calculateAdaptiveDifficulty(history, currentBests) {
  // Get the last two sessions
  const lastTwo = (history || []).slice(0, 2);
  
  // Check if both were logged as 'easy'
  const isTooEasy = lastTwo.length === 2 && lastTwo.every(log => log.mood === 'easy');
  
  if (isTooEasy) {
    const updatedBests = { ...(currentBests || {}) };
    
    // Increment all weight-based bests by 5%
    Object.keys(updatedBests).forEach(exercise => {
      if (typeof updatedBests[exercise] === 'number') {
        updatedBests[exercise] = Math.round(updatedBests[exercise] * 1.05);
      }
    });
    
    return { 
      shouldUpdate: true, 
      newTargets: updatedBests,
      message: "You made the last 2 sessions look easy. I've increased your weight targets by 5% to keep the gains coming."
    };
  }
  
  return { shouldUpdate: false };
}

/**
 * Check if user should receive a suggestion to increase weights
 * @param {Array} history - Workout history
 * @returns {Object} { shouldSuggest: boolean, exercise: string }
 */
export function checkForWeightSuggestion(history) {
  const recentLogs = (history || []).slice(0, 5);
  
  // Count consecutive "easy" sessions
  let easyStreak = 0;
  for (const log of recentLogs) {
    if (log.mood === 'easy') easyStreak++;
    else break;
  }

  if (easyStreak >= 3) {
    return {
      shouldSuggest: true,
      message: `You've reported ${easyStreak} easy sessions in a row. Consider adding 5-10% more weight to your lifts.`
    };
  }

  return { shouldSuggest: false };
}
