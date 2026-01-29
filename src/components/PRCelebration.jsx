import { useState, useEffect } from 'react';
import { Trophy, Flame, Star, ArrowRight, Share2, X, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import PRShareCard from './PRShareCard';
import useUnit from '../hooks/useUnit';

export default function PRCelebration({ prData, userLevel, xpBonus, onContinue, onClose }) {
  const { convert, label } = useUnit();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Epic confetti animation sequence
  useEffect(() => {
    // Phase 1: Initial burst
    const burst1 = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#fbbf24', '#ffffff'],
      });
      setAnimationPhase(1);
    }, 100);

    // Phase 2: Side cannons
    const burst2 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3b82f6', '#22c55e'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3b82f6', '#22c55e'],
      });
      setAnimationPhase(2);
    }, 400);

    // Phase 3: Gold rain
    const burst3 = setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0, x: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#ffffff'],
        ticks: 300,
        gravity: 0.8,
      });
      setAnimationPhase(3);
    }, 800);

    return () => {
      clearTimeout(burst1);
      clearTimeout(burst2);
      clearTimeout(burst3);
    };
  }, []);

  // Share card view
  if (showShareOptions) {
    return (
      <div className="fixed inset-0 z-200 bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
        <PRShareCard 
          prData={prData} 
          userLevel={userLevel}
          onClose={() => setShowShareOptions(false)}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-200 bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Animated Background Layers */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-900/20 via-black to-yellow-900/10" />
      
      {/* Pulsing Glow */}
      <div 
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] transition-all duration-1000 ${
          animationPhase >= 2 ? 'bg-blue-500/30 scale-100' : 'bg-blue-500/0 scale-50'
        }`}
      />

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 text-zinc-500 hover:text-white p-2 z-10"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {/* Main Content */}
      <div className={`relative z-10 text-center max-w-sm transition-all duration-700 ${
        animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        
        {/* Trophy Icon */}
        <div className={`mb-6 transition-all duration-500 ${
          animationPhase >= 2 ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
        }`}>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-50 animate-pulse" />
            <div className="relative bg-linear-to-br from-yellow-400 to-yellow-600 p-6 rounded-3xl">
              <Trophy size={48} className="text-black" />
            </div>
          </div>
        </div>

        {/* PR Badge */}
        <div className={`inline-flex items-center gap-2 bg-linear-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 rounded-full mb-4 transition-all duration-500 ${
          animationPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}>
          <Flame size={16} className="animate-bounce" />
          <span className="font-black text-xs uppercase tracking-widest">Personal Record</span>
          <Flame size={16} className="animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black italic text-white tracking-tighter mb-2">
          NEW <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-yellow-500 to-orange-500">BEST!</span>
        </h1>

        {/* Exercise Name */}
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm mb-8">
          {prData.exercise}
        </p>

        {/* The Big Number */}
        <div className={`mb-8 transition-all duration-700 delay-300 ${
          animationPhase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}>
          <div className="relative inline-block">
            <span className="text-8xl font-black text-white italic tracking-tighter">
              {convert(prData.value)}
            </span>
            <span className="text-yellow-500 font-black text-2xl italic ml-2">
              {label}
            </span>
          </div>
          
          {/* Improvement Badge */}
          {prData.previousBest && prData.previousBest > 0 && (
            <div className="mt-4 flex justify-center">
              <div className="bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-xl">
                <p className="text-green-400 font-bold text-sm">
                  <span className="text-green-500">↑</span> +{convert(prData.value - prData.previousBest)} {label} from {convert(prData.previousBest)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* XP Bonus Card */}
        <div className={`bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 mb-8 transition-all duration-500 delay-500 ${
          animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center justify-center gap-3">
            <Zap className="text-blue-400" size={20} />
            <div className="text-left">
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">2X XP Multiplier Active</p>
              <p className="text-white font-black text-lg">+{xpBonus || 0} BONUS XP</p>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <p className="text-zinc-600 text-xs italic mb-8 px-8">
          "The iron never lies. Today you proved you're stronger than yesterday."
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowShareOptions(true)}
            className="w-full flex items-center justify-center gap-2 text-blue-400 font-bold uppercase text-[10px] tracking-widest border border-blue-500/20 px-4 py-3 rounded-xl hover:bg-blue-500/10 transition-colors"
          >
            <Share2 size={14} /> Generate Share Card
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="w-full bg-linear-to-r from-yellow-500 to-orange-500 text-black font-black italic py-4 rounded-xl flex items-center justify-center gap-2 hover:from-yellow-400 hover:to-orange-400 active:scale-95 transition-all shadow-lg shadow-yellow-500/20"
          >
            CONTINUE <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Floating Stars Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`absolute text-yellow-500/30 animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
