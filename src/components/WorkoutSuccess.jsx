import { useEffect } from 'react';
import { CheckCircle2, Trophy, ArrowRight, HeartPulse, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WorkoutSuccess({ workout, xpEarned, onStartRecovery, onFinish }) {
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#2dd4bf', '#fbbf24'],
    });
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      {/* Success Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
        <CheckCircle2 size={80} className="text-blue-500 relative z-10" />
      </div>

      <h1 className="text-4xl font-black italic text-white tracking-tighter mb-2">
        MISSION <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-teal-400">COMPLETE</span>
      </h1>
      <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-8">
        {workout?.title || 'Workout'}
      </p>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <Trophy className="text-yellow-500 mx-auto mb-2" size={20} />
          <p className="text-2xl font-black text-white">+{xpEarned || 0}</p>
          <p className="text-[10px] text-zinc-500 uppercase font-bold">XP Gained</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <Share2 className="text-blue-400 mx-auto mb-2" size={20} />
          <p className="text-2xl font-black text-white">100%</p>
          <p className="text-[10px] text-zinc-500 uppercase font-bold">Intensity</p>
        </div>
      </div>

      {/* The Recovery Funnel */}
      <div className="w-full max-w-sm space-y-4">
        <button
          type="button"
          onClick={onStartRecovery}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-900/40 transition-all active:scale-95 group"
        >
          <HeartPulse className="group-hover:animate-bounce" size={20} />
          START RECOVERY ROOM
          <ArrowRight size={18} />
        </button>

        <button
          type="button"
          onClick={onFinish}
          className="w-full bg-zinc-900 text-zinc-400 font-bold py-4 rounded-2xl hover:text-white transition-colors"
        >
          SKIP TO DASHBOARD
        </button>
      </div>

      <p className="mt-8 text-zinc-600 text-[10px] uppercase tracking-widest leading-relaxed px-12">
        &ldquo;Recovery is where the growth happens. Spend 5 minutes on the foam roller to stay in the game.&rdquo;
      </p>
    </div>
  );
}
