import { useState } from 'react';
import { X, Target, Lightbulb, Video, Settings2, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { getExerciseDetails } from '../data/exerciseLibrary';
import FormCheckView from './FormCheckView';
import { suggestExerciseAlternative } from '../utils/geminiCoach';
import useProgress from '../hooks/useProgress';

export default function ExerciseModal({ exerciseName, onClose }) {
  const details = getExerciseDetails(exerciseName);
  const { profile, history, bests } = useProgress();
  const [showFormCheck, setShowFormCheck] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [alternative, setAlternative] = useState(null);

  const handleModify = async () => {
    setIsModifying(true);
    try {
      const alt = await suggestExerciseAlternative(
        exerciseName, 
        "needs an alternative with similar metabolic stress", 
        { profile, history, bests }
      );
      setAlternative(alt);
    } catch (error) {
      console.error("Modification failed:", error);
      alert("Failed to find alternative. Stick to the plan or try again.");
    } finally {
      setIsModifying(false);
    }
  };

  if (showFormCheck) {
    return (
      <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center pointer-events-none p-4">
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl pointer-events-auto" onClick={() => setShowFormCheck(false)} />
        <div className="relative w-full max-w-lg pointer-events-auto">
          <FormCheckView 
            exerciseName={exerciseName} 
            onClose={() => setShowFormCheck(false)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop (click to close) */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal content */}
      <div
        className="relative w-full max-w-lg bg-zinc-950 border-t sm:border border-zinc-800 rounded-t-[2.5rem] sm:rounded-3xl p-6 pointer-events-auto shadow-2xl transition-transform duration-300 translate-y-0 max-h-[90vh] overflow-y-auto custom-scrollbar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2
              id="exercise-modal-title"
              className="text-2xl font-black text-white italic tracking-tighter uppercase"
            >
              {exerciseName}
            </h2>
            <div className="flex items-center gap-2 text-blue-400 mt-1">
              <Target size={14} aria-hidden />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">{details.targets}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-zinc-900 rounded-full text-zinc-500 hover:text-white border border-zinc-800"
            aria-label="Close exercise demo"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        {/* Visual placeholder (or real image when available) */}
        <div className="w-full h-48 bg-zinc-900 rounded-3xl mb-6 flex items-center justify-center border border-zinc-800 relative overflow-hidden group">
          {details.image ? (
            <img src={details.image} alt="" className="h-full object-contain group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="text-zinc-800 animate-spin" size={32} />
              <span className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">Visual Demo Loading...</span>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/5">
            <Sparkles size={16} className="text-blue-500" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button 
            onClick={() => setShowFormCheck(true)}
            className="flex flex-col items-center gap-2 bg-blue-600/10 border border-blue-500/20 p-4 rounded-3xl hover:bg-blue-600/20 transition-all group"
          >
            <Video className="text-blue-500 group-hover:scale-110 transition-transform" size={24} />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">AI Form Check</span>
          </button>
          <button 
            onClick={handleModify}
            disabled={isModifying}
            className="flex flex-col items-center gap-2 bg-zinc-900 border border-zinc-800 p-4 rounded-3xl hover:bg-zinc-800 transition-all group disabled:opacity-50"
          >
            {isModifying ? (
              <Loader2 className="text-zinc-500 animate-spin" size={24} />
            ) : (
              <Settings2 className="text-zinc-500 group-hover:rotate-90 transition-transform duration-500" size={24} />
            )}
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Modify Move</span>
          </button>
        </div>

        {/* Alternative Suggestion */}
        {alternative && (
          <div className="mb-8 p-5 bg-blue-600/10 border border-blue-500/20 rounded-3xl animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-blue-500/10 rotate-12"><Sparkles size={64} /></div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-blue-400" size={14} />
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">AI Suggested Alternative</p>
            </div>
            <p className="text-white text-sm font-medium leading-relaxed relative z-10">
              {alternative}
            </p>
            <button 
              onClick={() => setAlternative(null)}
              className="mt-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              Clear Alternative
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="space-y-6">
          <div>
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <ArrowRight size={12} /> Execution Strategy
            </h3>
            <ul className="space-y-4">
              {details.steps.map((step, i) => (
                <li key={i} className="flex gap-4 text-sm text-zinc-300 items-start">
                  <span className="w-6 h-6 rounded-xl bg-zinc-900 border border-zinc-800 text-blue-500 flex items-center justify-center text-[10px] font-black shrink-0 shadow-lg">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trainer's tip */}
          {details.tips && (
            <div className="bg-linear-to-br from-zinc-900 to-black border border-zinc-800 p-5 rounded-3xl flex gap-4 relative overflow-hidden">
              <div className="absolute -left-2 -bottom-2 text-yellow-500/10 rotate-12"><Lightbulb size={64} /></div>
              <Lightbulb className="text-yellow-500 shrink-0 relative z-10" size={20} aria-hidden />
              <div className="relative z-10">
                <h4 className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                  Trainer&apos;s Strategy
                </h4>
                <p className="text-zinc-400 text-xs italic leading-relaxed">
                  &ldquo;{details.tips}&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-8 bg-white text-black font-black py-5 rounded-2xl active:scale-95 transition-all shadow-xl hover:shadow-2xl hover:bg-zinc-100 uppercase italic tracking-tighter"
        >
          MISSION ACKNOWLEDGED
        </button>
      </div>
    </div>
  );
}
