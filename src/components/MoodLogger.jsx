import { Smile, Zap, Flame } from 'lucide-react';

/**
 * MoodLogger - "Vibe Check" component
 * Captures post-workout feeling to track CNS fatigue and inform adaptive difficulty.
 */

const MOODS = [
  { 
    id: 'easy', 
    label: 'Cruising', 
    icon: Smile, 
    color: 'text-green-400', 
    bg: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    desc: 'Could have done more.' 
  },
  { 
    id: 'perfect', 
    label: 'Optimal', 
    icon: Zap, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    desc: 'Challenging but controlled.' 
  },
  { 
    id: 'brutal', 
    label: 'Redline', 
    icon: Flame, 
    color: 'text-red-400', 
    bg: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    desc: 'Barely finished the sets.' 
  }
];

export default function MoodLogger({ onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
      <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-2">
        Vibe <span className="text-blue-500">Check</span>
      </h2>
      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-10">
        How did that session feel?
      </p>

      <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onSelect(mood.id)}
            className={`flex items-center gap-4 p-5 rounded-3xl border transition-all active:scale-95 group hover:border-zinc-600 ${mood.bg} ${mood.borderColor}`}
          >
            <div className={`p-3 rounded-2xl bg-zinc-900 ${mood.color}`}>
              <mood.icon size={24} />
            </div>
            <div className="text-left">
              <p className={`font-black uppercase italic tracking-tight ${mood.color}`}>
                {mood.label}
              </p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase">
                {mood.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      <p className="text-[10px] text-zinc-600 mt-8 text-center max-w-xs">
        This helps the app adjust your training intensity and detect signs of overtraining.
      </p>
    </div>
  );
}
