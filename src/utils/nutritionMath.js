/**
 * Suggested daily protein (g) based on weight and training intensity.
 * Big Book: 1.2–2.0 g per kg body weight depending on activity.
 */
export function calculateSuggestedProtein(weight, unit, intensityLevel) {
  const weightInKg = unit === 'lbs' ? weight * 0.453592 : weight;
  const multipliers = {
    low: 1.2,
    moderate: 1.6,
    high: 2.0,
  };
  const multiplier = multipliers[intensityLevel] || 1.6;
  return Math.round(weightInKg * multiplier);
}
