import { ArrowLeft, Lock, Check, CheckCircle2, Zap, Trophy, Shield, Dumbbell, ChevronRight } from 'lucide-react';
import { skillTree, getTierProgress, SKILL_BRANCHES } from '../data/skills';
import useProgress from '../hooks/useProgress';
import { checkSkillUnlock, calculateSkillProgress } from '../utils/skillValidator';

export default function SkillTreeView({ xp = 0, onBack }) {
  const progressData = useProgress();
  const bests = progressData?.bests || {};
  const profile = progressData?.profile || {};
  const { current, max, percentage } = getTierProgress(xp || 0);

  // Safety check - if progress data failed to load
  if (!progressData) {
    return (
      <div className="min-h-screen bg-black text-zinc-100 p-6 flex items-center justify-center">
        <p className="text-zinc-500">Loading skill tree...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft />
        </button>
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter text-white">
            SKILL <span className="text-yellow-500">TREE</span>
          </h2>
          <p className="text-xs text-zinc-500 font-mono">TIER 1 MASTERY</p>
        </div>
      </div>

      {/* Mastery Bar */}
      <div className="mb-12">
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
          <span>Progress</span>
          <span>{current} / {max} XP</span>
        </div>
        <div className="h-4 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-linear-to-r from-blue-600 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* The Tree */}
      <div className="relative space-y-12 pl-4 mb-20">
        {/* Vertical Connecting Line */}
        <div className="absolute left-8 top-4 bottom-12 w-1 bg-zinc-800 -z-10" />

        {(skillTree || []).map((node, index) => {
          const isUnlocked = xp >= node.requiredXp;
          const isNext = !isUnlocked && (index === 0 || xp >= skillTree[index - 1].requiredXp);
          const Icon = node.icon;

          return (
            <div key={node.id} className={`relative flex items-start gap-6 ${isUnlocked ? 'opacity-100' : 'opacity-50 grayscale'}`}>

              {/* Icon Node */}
              <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center shrink-0 z-10 bg-black
                ${isUnlocked
                  ? 'border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                  : isNext
                    ? 'border-blue-500 text-blue-500 animate-pulse'
                    : 'border-zinc-800 text-zinc-600'
                }`}
              >
                {isUnlocked ? <Check size={16} strokeWidth={4} /> : <Icon size={18} />}
              </div>

              {/* Content Card */}
              <div className={`flex-1 p-4 rounded-xl border transition-all
                ${isUnlocked
                  ? 'bg-zinc-900/80 border-yellow-500/30'
                  : 'bg-zinc-900/30 border-zinc-800'}`}>

                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-zinc-500'}`}>
                    {node.title}
                  </h3>
                  {!isUnlocked && (
                    <div className="flex items-center gap-1 text-xs font-mono text-zinc-600 bg-zinc-950 px-2 py-1 rounded">
                      <Lock size={10} /> {node.requiredXp} XP
                    </div>
                  )}
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                  {node.description}
                </p>

                {/* Unlock List */}
                <div className="flex flex-wrap gap-2">
                  {(node.unlocks || []).map(id => (
                    <span key={id} className={`text-[10px] uppercase font-bold px-2 py-1 rounded border
                      ${isUnlocked
                        ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
                      {id.includes('weightless') ? 'Bodyweight' : id.includes('interval') ? 'Interval' : 'Weights'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BRANCHING PATHS */}
      <div className="space-y-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-zinc-800" />
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Elite Branches</h2>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-zinc-800" />
        </div>

        {Object.entries(SKILL_BRANCHES || {}).map(([branchName, branch]) => (
          <div key={branchName} className="relative">
            {/* Branch Header */}
            <div className="flex items-center gap-3 mb-6">
              <h3 className={`text-xs font-black uppercase tracking-[0.3em] ${branch.color}`}>
                {branchName} Path
              </h3>
              <div className={`h-px flex-1 bg-linear-to-r from-zinc-800 to-transparent`} />
            </div>

            {/* Skill Nodes */}
            <div className="grid grid-cols-1 gap-4">
              {(branch.skills || []).map((skill) => {
                const isUnlocked = checkSkillUnlock(skill, bests, profile);
                const progress = calculateSkillProgress(skill, bests, profile);

                return (
                  <div 
                    key={skill.id}
                    className={`relative p-5 rounded-4xl border transition-all duration-500 ${
                      isUnlocked 
                      ? `${branch.border} bg-zinc-900 shadow-[0_0_20px_rgba(59,130,246,0.1)]` 
                      : 'border-zinc-800 bg-black/40'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-3xl">{skill.icon}</span>
                      {isUnlocked ? (
                        <div className={`p-1.5 rounded-full bg-zinc-800 border ${branch.border}`}>
                          <CheckCircle2 className={branch.color} size={18} />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-full bg-zinc-950 border border-zinc-800">
                          <Lock className="text-zinc-700" size={18} />
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <h4 className={`font-black italic uppercase tracking-tighter text-lg mb-1 ${isUnlocked ? 'text-white' : 'text-zinc-500'}`}>
                        {skill.name}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase leading-tight">
                        CHALLENGE: {skill.req?.value}{skill.req?.type === 'bw_ratio' ? 'x BW' : skill.req?.type === 'seconds' ? 's' : ''} {skill.req?.exercise}
                      </p>
                    </div>
                    
                    {isUnlocked ? (
                      <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/50">
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${branch.color}`}>Active Perk</p>
                        <p className="text-white text-xs font-bold italic">{skill.perk}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-600">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/30">
                          <div 
                            className={`h-full ${branch.bg} transition-all duration-1000`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
