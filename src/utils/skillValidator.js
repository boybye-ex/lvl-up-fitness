/**
 * Skill Validation Logic
 * Checks challenge requirements against user stats and profile
 */

export const checkSkillUnlock = (skill, bests = {}, profile = {}) => {
  if (!skill.req) return true; // No requirement means unlocked by default
  
  const { exercise, value, type } = skill.req;
  const best = bests[exercise] || 0;
  const userWeight = profile.weight || 180; // Fallback weight
  
  if (type === 'bw_ratio') {
    return best >= (userWeight * value);
  }
  
  if (type === 'reps' || type === 'seconds') {
    return best >= value;
  }
  
  return false;
};

export const calculateSkillProgress = (skill, bests = {}, profile = {}) => {
  if (!skill.req) return 100;
  
  const { exercise, value, type } = skill.req;
  const best = bests[exercise] || 0;
  const userWeight = profile.weight || 180;
  
  const target = type === 'bw_ratio' ? (userWeight * value) : value;
  
  return Math.min(Math.round((best / target) * 100), 100);
};
