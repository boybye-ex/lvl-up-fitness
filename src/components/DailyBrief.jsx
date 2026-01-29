import { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, TrendingUp, X, Loader2 } from 'lucide-react';
import { generateBrief } from '../utils/briefLogic';

/**
 * DailyBrief - The "Coach's Corner" component
 * Displays personalized coaching based on yesterday's workout and nutrition data.
 */
export default function DailyBrief({ profile, history, foodLogs, onAction, pendingNotifications, onClearNotification }) {
  const [brief, setBrief] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBrief() {
      setIsLoading(true);
      try {
        const result = await generateBrief(profile, history, foodLogs);
        setBrief(result);
      } catch (error) {
        console.error("Failed to generate brief:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBrief();
  }, [profile, history, foodLogs]);

  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 mb-8 flex flex-col items-center justify-center min-h-[140px]">
        <Loader2 className="text-zinc-700 animate-spin mb-2" size={24} />
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Generating Coach's Brief...</p>
      </div>
    );
  }

  if (!brief) return null;

  return (
    <div className="space-y-4 mb-8">
      {/* Adaptive Boost Notifications */}
      {pendingNotifications?.map((note, i) => (
        <div 
          key={i} 
          className="bg-blue-600 p-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top duration-500"
        >
          <div className="bg-white/20 p-2 rounded-lg text-white shrink-0">
            <TrendingUp size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">{note.title}</h4>
            <p className="text-sm font-bold text-white leading-snug">{note.message}</p>
          </div>
          <button 
            onClick={() => onClearNotification?.(i)} 
            className="text-white/60 hover:text-white transition-colors shrink-0"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      {/* Main Brief Card */}
      <div className={`${brief.bg} ${brief.borderColor} border rounded-3xl p-5 animate-in fade-in slide-in-from-top duration-700 relative overflow-hidden`}>
        {brief.isAI && (
          <div className="absolute -right-4 -top-4 text-blue-500/5 rotate-12"><Sparkles size={120} /></div>
        )}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{brief.icon}</span>
            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${brief.color}`}>
              {brief.title}
            </h3>
          </div>
          <Sparkles size={14} className={brief.color} />
        </div>

        <p className="text-zinc-200 text-sm leading-relaxed mb-4 font-medium relative z-10">
          "{brief.message}"
        </p>

        {onAction && (
          <button 
            onClick={onAction}
            className="flex items-center gap-1 text-[10px] font-bold text-white/50 uppercase hover:text-white transition-colors group relative z-10"
          >
            View Detailed Stats 
            <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}

