/**
 * Unit Conversion Utilities
 * Standardizes weight storage in LBS while allowing KG display
 */

export const lbsToKg = (lbs) => {
  if (!lbs) return 0;
  return Math.round(lbs * 0.453592 * 10) / 10;
};

export const kgToLbs = (kg) => {
  if (!kg) return 0;
  return Math.round(kg / 0.453592);
};

/**
 * Display weight based on preferred unit
 * @param {number} lbsValue - Raw weight in LBS
 * @param {string} unit - 'lbs' or 'kg'
 * @returns {number} - Converted value
 */
export const displayWeight = (lbsValue, unit) => {
  if (unit === 'kg') return lbsToKg(lbsValue);
  return lbsValue;
};
