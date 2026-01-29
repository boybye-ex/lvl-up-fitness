import { useEffect, useState } from 'react';
import { ACHIEVEMENT_GROUPS } from '../data/badges';

export default function AchievementToast({ badge, onClear }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (badge) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClear, 500); // Wait for exit animation
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [badge, onClear]);

  if (!badge) return null;

  const group = ACHIEVEMENT_GROUPS[badge.group] || ACHIEVEMENT_GROUPS.COMBAT;
  const Icon = badge.icon;

  return (
    <div 
      className={`fixed top-6 left-4 right-4 z-300 max-w-md mx-auto transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
      }`}
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
        {/* Animated Background Glow */}
        <div className={`absolute inset-0 opacity-10 blur-xl ${group.color.replace('text', 'bg')}`} />
        
        <div className={`relative z-10 p-3 rounded-xl bg-zinc-800 border border-zinc-700 ${group.color}`}>
          <Icon size={28} strokeWidth={2} />
        </div>
        
        <div className="relative z-10 flex-1">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-0.5">
            Achievement Unlocked
          </p>
          <h4 className="text-white font-black italic uppercase tracking-tighter text-lg leading-none mb-1">
            {badge.title}
          </h4>
          <p className="text-zinc-400 text-[10px] font-bold uppercase leading-tight">
            {badge.description}
          </p>
        </div>

        {/* Tactical Corner Decoration */}
        <div className={`absolute top-0 right-0 w-16 h-16 opacity-20 ${group.color.replace('text', 'bg')}`} style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
      </div>
    </div>
  );
}
