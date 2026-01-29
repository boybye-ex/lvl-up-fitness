/**
 * Strength Milestones Data
 * Based on the Big Book's strength standards for foundational movements.
 * These provide clear progression paths from "Rookie" to "Spartan".
 */

export const strengthMilestones = {
  "Pushups": {
    unit: "Reps",
    isReps: true,
    levels: [
      { rank: "Rookie", value: 10, reward: "Chest Plate Badge", color: "text-zinc-400" },
      { rank: "Savage", value: 30, reward: "Iron Pectoral Badge", color: "text-blue-400" },
      { rank: "Spartan", value: 50, reward: "Titanium Chest Badge", color: "text-yellow-400" }
    ]
  },
  "Goblet Squat": {
    unit: "lbs",
    isReps: false,
    levels: [
      { rank: "Rookie", value: 25, reward: "Foundation Badge", color: "text-zinc-400" },
      { rank: "Savage", value: 50, reward: "Pillar of Strength", color: "text-blue-400" },
      { rank: "Spartan", value: 85, reward: "Legionnaire Badge", color: "text-yellow-400" }
    ]
  },
  "Plank Hold": {
    unit: "Sec",
    isReps: false,
    levels: [
      { rank: "Rookie", value: 60, reward: "Steady Core Badge", color: "text-zinc-400" },
      { rank: "Savage", value: 120, reward: "Unshakable Badge", color: "text-blue-400" },
      { rank: "Spartan", value: 180, reward: "Iron Core Badge", color: "text-yellow-400" }
    ]
  },
  "Dumbbell Row": {
    unit: "lbs",
    isReps: false,
    levels: [
      { rank: "Rookie", value: 25, reward: "Back Builder Badge", color: "text-zinc-400" },
      { rank: "Savage", value: 50, reward: "Lat Dominator Badge", color: "text-blue-400" },
      { rank: "Spartan", value: 75, reward: "Pull Power Badge", color: "text-yellow-400" }
    ]
  },
  "Lunges": {
    unit: "lbs",
    isReps: false,
    levels: [
      { rank: "Rookie", value: 0, reward: "First Step Badge", color: "text-zinc-400" },
      { rank: "Savage", value: 30, reward: "Stride Master Badge", color: "text-blue-400" },
      { rank: "Spartan", value: 50, reward: "Legionnaire Badge", color: "text-yellow-400" }
    ]
  },
  "Shoulder Press": {
    unit: "lbs",
    isReps: false,
    levels: [
      { rank: "Rookie", value: 20, reward: "Shoulder Starter Badge", color: "text-zinc-400" },
      { rank: "Savage", value: 40, reward: "Boulder Shoulder Badge", color: "text-blue-400" },
      { rank: "Spartan", value: 65, reward: "Atlas Badge", color: "text-yellow-400" }
    ]
  }
};

/**
 * Get the current rank for an exercise based on personal best
 * @param {string} exercise - Exercise name
 * @param {number} currentBest - User's personal best
 * @returns {Object} { currentRank, nextRank, progress }
 */
export function getExerciseRank(exercise, currentBest) {
  const milestone = strengthMilestones[exercise];
  if (!milestone) return null;

  const best = currentBest || 0;
  const levels = milestone.levels;

  // Find current rank (highest level achieved)
  let currentRank = null;
  let nextRank = levels[0];

  for (let i = 0; i < levels.length; i++) {
    if (best >= levels[i].value) {
      currentRank = levels[i];
      nextRank = levels[i + 1] || null;
    }
  }

  // Calculate progress to next rank
  const progress = nextRank 
    ? Math.min((best / nextRank.value) * 100, 100)
    : 100;

  return {
    currentRank,
    nextRank,
    progress,
    currentBest: best,
    unit: milestone.unit
  };
}

/**
 * Check if user just achieved a new milestone
 * @param {string} exercise - Exercise name
 * @param {number} oldBest - Previous best
 * @param {number} newBest - New best
 * @returns {Object|null} The milestone achieved or null
 */
export function checkMilestoneAchieved(exercise, oldBest, newBest) {
  const milestone = strengthMilestones[exercise];
  if (!milestone) return null;

  // Find any levels crossed
  const crossedLevel = milestone.levels.find(
    level => newBest >= level.value && (oldBest || 0) < level.value
  );

  if (crossedLevel) {
    return {
      exercise,
      ...crossedLevel,
      unit: milestone.unit
    };
  }

  return null;
}
