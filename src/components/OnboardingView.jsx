import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { lifestyles } from '../data/lifestyles';

export default function OnboardingView({ onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleNext = () => {
    if (selectedId) setStep(2);
  };

  const handleFinish = () => {
    const profile = lifestyles.find((l) => l.id === selectedId);
    onComplete(profile);
  };

  const selectedProfile = lifestyles.find((l) => l.id === selectedId);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      {/* STEP 1: SELECTION */}
      {step === 1 && (
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black italic tracking-tighter">
              SELECT YOUR <span className="text-yellow-500">LIFESTYLE</span>
            </h1>
            <p className="text-zinc-400 text-sm">
              We&apos;ll customize your strategy based on the &quot;Real-Life Scenarios&quot; from the book.
            </p>
          </div>

          <div className="space-y-3">
            {lifestyles.map((style) => {
              const Icon = style.icon;
              const isSelected = selectedId === style.id;

              return (
                <div
                  key={style.id}
                  onClick={() => handleSelect(style.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(style.id);
                    }
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4
                    ${isSelected
                      ? 'bg-zinc-800 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                      : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'}`}
                >
                  <div
                    className={`p-3 rounded-full ${isSelected ? 'bg-yellow-500 text-black' : 'bg-black text-zinc-500'}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                      {style.title}
                    </h3>
                    <p className="text-xs text-zinc-500">{style.description}</p>
                  </div>
                  {isSelected && <Check className="text-yellow-500 shrink-0" size={20} />}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedId}
            className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl shadow-lg shadow-yellow-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            NEXT STEP <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* STEP 2: THE PRESCRIPTION */}
      {step === 2 && selectedProfile && (
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">
              Your Recommended Plan
            </p>
            <h1 className="text-4xl font-black italic tracking-tighter text-white mb-1">
              THE{' '}
              <span className="text-yellow-500">
                {selectedProfile.recommendation.toUpperCase()}
              </span>
            </h1>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              {(() => {
                const ProfileIcon = selectedProfile.icon;
                return <ProfileIcon size={100} />;
              })()}
            </div>

            <div>
              <h3 className="text-yellow-500 font-bold text-sm uppercase mb-1">Best Workout Time</h3>
              <p className="text-2xl font-mono text-white">{selectedProfile.schedule}</p>
            </div>

            <div>
              <h3 className="text-blue-400 font-bold text-sm uppercase mb-1">Expert Strategy</h3>
              <p className="text-zinc-300 text-sm leading-relaxed italic">
                &quot;{selectedProfile.strategy}&quot;
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-500">
                Based on &quot;{selectedProfile.quote}&quot; - Stronger Faster, Page{' '}
                {selectedProfile.sourcePage}
              </p>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="w-full bg-white text-black font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all"
          >
            LOCK IN PLAN & START
          </button>
        </div>
      )}
    </div>
  );
}
