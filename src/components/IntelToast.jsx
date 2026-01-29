import { Target } from 'lucide-react';

/**
 * Intel Toast Component
 * Mid-workout HUD element for achievement proximity alerts
 */
export default function IntelToast({ toast, onClear }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-150 w-[85%] max-w-xs animate-in slide-in-from-bottom-4 fade-in">
      <div className="bg-zinc-900/90 backdrop-blur-md border border-blue-500/30 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden">
        {/* Progress Spinner Background */}
        <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
        
        <div className="shrink-0 bg-blue-600/20 p-2 rounded-xl relative z-10">
          <Target className="text-blue-500" size={16} />
        </div>
        
        <div className="flex-1 relative z-10">
          <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-0.5">Live Intel</p>
          <p className="text-[11px] text-white font-bold italic uppercase tracking-tight leading-none">
            <span className="mr-1.5 inline-block scale-125">{toast.icon}</span>
            {toast.message}
          </p>
        </div>

        {/* Mini Progress Ring */}
        <div className="relative z-10 w-6 h-6 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-zinc-800 rounded-full" />
          <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}
