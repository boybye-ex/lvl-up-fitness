import { useState } from 'react';
import { Lock, CheckCircle2, X } from 'lucide-react';
import { badges, ACHIEVEMENT_GROUPS } from '../data/badges';

export default function TrophyRoom({ unlockedBadges = [], badgeUnlocks = {} }) {
  const [selectedBadge, setSelectedBadge] = useState(null);

  return (
    <div className="space-y-10 pb-24">
      {Object.entries(ACHIEVEMENT_GROUPS).map(([key, group]) => {
        const groupBadges = badges.filter(b => b.group === key);
        const earnedCount = groupBadges.filter(b => unlockedBadges.includes(b.id)).length;
        const Icon = group.icon;

        return (
          <div key={key} className="relative">
            {/* Group Header */}
            <div className="flex justify-between items-end mb-4 px-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${group.color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-[0.2em] ${group.color}`}>
                    {group.label}
                  </h3>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">
                    {earnedCount} / {groupBadges.length} Collected
                  </p>
                </div>
              </div>
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-3 gap-3">
              {groupBadges.map((badge) => {
                const isEarned = unlockedBadges.includes(badge.id);
                const BadgeIcon = badge.icon;
                
                return (
                  <button 
                    key={badge.id}
                    onClick={() => isEarned && setSelectedBadge({ ...badge, unlockedAt: badgeUnlocks[badge.id] })}
                    className={`relative aspect-square rounded-3xl flex flex-col items-center justify-center border transition-all duration-500 ${
                      isEarned 
                      ? 'bg-zinc-900 border-zinc-700 shadow-lg cursor-pointer hover:scale-105 active:scale-95' 
                      : 'bg-black/20 border-zinc-900 grayscale opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span className={`mb-1 ${isEarned ? group.color : 'text-zinc-700'}`}>
                      <BadgeIcon size={32} strokeWidth={1.5} />
                    </span>
                    <span className="text-[7px] text-center px-1 font-black text-white uppercase tracking-tighter leading-tight">
                      {badge.title}
                    </span>
                    
                    {isEarned && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-black flex items-center justify-center">
                        <CheckCircle2 size={8} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-200 flex items-center justify-center p-6"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] text-center max-w-xs animate-in zoom-in-95 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-zinc-600 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="mb-6 flex justify-center">
              <div className={`w-24 h-24 rounded-full bg-zinc-800/50 border-2 border-zinc-700 flex items-center justify-center ${ACHIEVEMENT_GROUPS[selectedBadge.group].color}`}>
                <selectedBadge.icon size={48} strokeWidth={1.5} />
              </div>
            </div>

            <h3 className="text-2xl font-black text-white italic uppercase mb-2 tracking-tighter">
              {selectedBadge.title}
            </h3>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed font-medium">
              {selectedBadge.description}
            </p>

            {selectedBadge.unlockedAt && (
              <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl mb-8">
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-1">Mission Accomplished</p>
                <p className="text-white font-bold text-xs uppercase">
                  {new Date(selectedBadge.unlockedAt).toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-100 transition-all active:scale-95 uppercase tracking-widest text-xs"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
