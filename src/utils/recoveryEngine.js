/**
 * Recovery Engine
 * Monitors for signs of overtraining and triggers de-load mode.
 * Based on the Big Book's principle of avoiding accumulated fatigue.
 */

/**
 * Check if the user shows signs of overreaching/overtraining
 * @param {Array} history - Workout history with mood data
 * @returns {Object} { shouldDeload: boolean, reductionFactor: number, message: string }
 */
export function checkFatigueStatus(history) {
  const lastThree = (history || []).slice(0, 3);
  
  // Requirement: 3 consecutive 'brutal' logs
  const isOverreached = lastThree.length === 3 && lastThree.every(log => log.mood === 'brutal');
  
  if (isOverreached) {
    return {
      shouldDeload: true,
      reductionFactor: 0.5, // 50% intensity reduction
      message: "3 consecutive 'Redline' sessions detected. Central Nervous System fatigue is high. De-load initiated.",
      durationDays: 7
    };
  }
  
  // Check for 2 brutal sessions - warning mode
  const hasTwoBrutal = lastThree.filter(log => log?.mood === 'brutal').length >= 2;
  if (hasTwoBrutal) {
    return {
      shouldDeload: false,
      isWarning: true,
      message: "Your recent sessions have been intense. If the next one feels brutal too, consider taking it easier."
    };
  }
  
  return { shouldDeload: false, isWarning: false };
}

/**
 * Calculate de-load weights
 * @param {number} normalWeight - Regular training weight
 * @param {number} reductionFactor - How much to reduce (0.5 = 50%)
 * @returns {number} Reduced weight for de-load
 */
export function calculateDeloadWeight(normalWeight, reductionFactor = 0.5) {
  return Math.round(normalWeight * reductionFactor);
}

/**
 * Check if de-load period is over
 * @param {string} deloadStartDate - ISO date string when de-load started
 * @param {number} durationDays - How many days the de-load lasts
 * @returns {boolean} Whether de-load should end
 */
export function isDeloadComplete(deloadStartDate, durationDays = 7) {
  if (!deloadStartDate) return true;
  
  const start = new Date(deloadStartDate);
  const now = new Date();
  const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  
  return daysPassed >= durationDays;
}
