export const getRank = (level) => {
  if (level >= 50) return 'LIVING LEGEND';
  if (level >= 40) return 'TITAN';
  if (level >= 30) return 'SPARTAN';
  if (level >= 20) return 'WARRIOR';
  if (level >= 10) return 'ATHLETE';
  return 'ROOKIE';
};

export const getRankColor = (level) => {
  if (level >= 50) return 'text-purple-400';
  if (level >= 40) return 'text-red-500';
  if (level >= 30) return 'text-yellow-500';
  if (level >= 20) return 'text-blue-400';
  if (level >= 10) return 'text-green-400';
  return 'text-zinc-500';
};

/** Returns percent progress to the next rank (e.g. Level 15 is 50% to Warrior). */
export const getRankProgress = (level) => {
  if (level >= 50) return 100;
  const currentTierStart = Math.floor(level / 10) * 10;
  const progressInTier = level - currentTierStart;
  return (progressInTier / 10) * 100;
};
