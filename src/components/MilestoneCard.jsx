import { Medal, ChevronRight, Trophy, Star } from 'lucide-react';

/**
 * MilestoneCard - Displays progress toward strength standards
 * Shows current level, progress to next rank, and visual progress bar.
 */
export default function MilestoneCard({ exercise, currentBest, milestones }) {
  const best = currentBest || 0;
  const levels = milestones.levels;
  
  // Determine current rank and next target
  let currentRank = null;
  let nextMilestone = levels[0];
  
  for (let i = 0; i < levels.length; i++) {
    if (best >= levels[i].value) {
      currentRank = levels[i];
      nextMilestone = levels[i + 1] || null;
    }
  }

  // Calculate progress percentage
  const progress = nextMilestone 
    ? Math.min((best / nextMilestone.value) * 100, 100)
    : 100;

  const isMaxed = !nextMilestone;

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl relative overflow-hidden group hover:border-zinc-700 transition-all">
      {/* Spartan glow effect when maxed */}
      {isMaxed && (
        <div className="absolute inset-0 bg-linear-to-br from-yellow-500/5 to-transparent pointer-events-none" />
      )}

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h4 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{exercise}</h4>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-white italic tracking-tighter">
              {best}
            </p>
            <span className="text-xs text-zinc-500 font-bold uppercase">{milestones.unit}</span>
          </div>
        </div>
        <div className={`p-2 rounded-xl ${isMaxed ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'}`}>
          {isMaxed ? <Trophy size={20} /> : <Medal size={20} />}
        </div>
      </div>

      {/* Current Rank Badge */}
      {currentRank && (
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase ${currentRank.color} bg-zinc-800`}>
            <Star size={10} className="fill-current" />
            {currentRank.rank}
          </span>
        </div>
      )}

      {/* Progress Bar */}
      {nextMilestone && (
        <>
          <div className="relative h-2 w-full bg-zinc-800 rounded-full mb-3 overflow-hidden">
            <div 
              className="absolute h-full bg-linear-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
              Next Goal: <span className="text-white">{nextMilestone.value} {milestones.unit}</span>
            </p>
            <p className={`text-[9px] font-black uppercase italic ${nextMilestone.color}`}>
              Target: {nextMilestone.rank}
            </p>
          </div>
        </>
      )}

      {/* Max Level Achieved */}
      {isMaxed && (
        <div className="flex items-center justify-center gap-2 py-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
          <Trophy size={14} className="text-yellow-500" />
          <span className="text-xs font-black text-yellow-400 uppercase">Spartan Achieved</span>
        </div>
      )}
    </div>
  );
}

/**
 * MilestoneSection - Container for all milestone cards in Profile view
 */
export function MilestoneSection({ milestones, bests, onViewDetails }) {
  const exerciseList = Object.entries(milestones);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-yellow-500" />
          <h3 className="text-lg font-black italic text-white uppercase tracking-tighter">
            Strength Standards
          </h3>
        </div>
        {onViewDetails && (
          <button 
            onClick={onViewDetails}
            className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1 hover:text-white transition-colors"
          >
            View All <ChevronRight size={12} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {exerciseList.map(([exerciseName, data]) => (
          <MilestoneCard 
            key={exerciseName}
            exercise={exerciseName}
            milestones={data}
            currentBest={bests?.[exerciseName] || 0}
          />
        ))}
      </div>

      <p className="text-[10px] text-zinc-600 text-center mt-6">
        Based on the Men's Health Big Book strength standards. Keep pushing!
      </p>
    </section>
  );
}
