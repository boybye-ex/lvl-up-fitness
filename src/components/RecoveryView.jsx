import { useState, useEffect } from 'react';
import { ArrowLeft, Timer, Wind } from 'lucide-react';
import { playBeep } from '../utils/sound';

const STRETCHES = [
  { name: "Shoulder Shrugs", desc: "Lift shoulders toward ears, hold 2 seconds, release. Repeat smoothly.", duration: 30 },
  { name: "Neck Rotations", desc: "Slowly roll chin toward chest, then shoulder to shoulder. No jerking.", duration: 30 },
  { name: "Chest Stretch", desc: "Clasp hands behind back, gently lift. Or door-frame stretch: arm at 90°, step through.", duration: 30 },
];

const STRETCH_DURATION = 30;

export default function RecoveryView({ onBack }) {
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(STRETCH_DURATION);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft === 0) {
      playBeep();
      if (currentIndex < STRETCHES.length - 1) {
        setCurrentIndex(i => i + 1);
        setTimeLeft(STRETCH_DURATION);
      } else {
        setIsActive(false);
        setCurrentIndex(0);
        setTimeLeft(STRETCH_DURATION);
      }
      return;
    }

    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentIndex]);

  const stretch = STRETCHES[currentIndex];

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft />
        </button>
        <h2 className="text-2xl font-black italic tracking-tighter text-white">
          RECOVERY <span className="text-emerald-500">ROOM</span>
        </h2>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900/50 border border-emerald-500/20 p-4 rounded-xl">
          <p className="text-sm text-zinc-400 italic">
            "Three minutes to a new you. Office stretching from the book—loosen up without leaving your desk."
          </p>
        </div>

        {!isActive ? (
          <>
            <div className="grid gap-4">
              {STRETCHES.map((s, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-start gap-4">
                  <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500 shrink-0">
                    <Wind size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{s.name}</h3>
                    <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{s.desc}</p>
                    <p className="text-zinc-500 text-xs mt-2 font-mono">{s.duration}s each</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setIsActive(true); setTimeLeft(STRETCH_DURATION); setCurrentIndex(0); }}
              className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all active:scale-[0.98]"
            >
              <Timer size={20} />
              Start 3-Minute Stretch
            </button>
          </>
        ) : (
          <div className="text-center space-y-8 py-8">
            <div className="w-48 h-48 rounded-full border-4 border-emerald-500 flex items-center justify-center mx-auto">
              <span className="text-5xl font-black font-mono text-emerald-400">{timeLeft}</span>
            </div>
            <div>
              <p className="text-zinc-500 text-sm mb-2">
                Stretch {currentIndex + 1} of {STRETCHES.length}
              </p>
              <h3 className="text-2xl font-bold text-white">{stretch.name}</h3>
              <p className="text-zinc-400 text-sm mt-2 italic">"{stretch.desc}"</p>
            </div>
            <button
              onClick={() => { setIsActive(false); setCurrentIndex(0); setTimeLeft(STRETCH_DURATION); }}
              className="text-zinc-500 hover:text-white text-sm font-bold uppercase"
            >
              Stop
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 left-6 right-6 max-w-md mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="w-full bg-green-600 text-white font-black py-4 rounded-2xl mt-8 hover:bg-green-500 transition-colors"
        >
          FINISH & SAVE SESSION
        </button>
      </div>
    </div>
  );
}
