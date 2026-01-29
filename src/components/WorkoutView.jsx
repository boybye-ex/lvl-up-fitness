import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Timer, CheckCircle2, Circle, Save, History, Scale, ChevronDown, ChevronUp, Info, Flame, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import ExerciseModal from './ExerciseModal';
import MoodLogger from './MoodLogger';
import { warmups } from '../data/warmups';
import { playBeep } from '../utils/sound';
import useProgress from '../hooks/useProgress';
import useUnit from '../hooks/useUnit';
import { useHaptics } from '../hooks/useHaptics';
import { getExerciseDetails } from '../data/exerciseLibrary';
import useLiveAchievementTracker from '../hooks/useLiveAchievementTracker';
import IntelToast from './IntelToast';

const getRestTime = (noteString) => {
  if (!noteString) return 60;
  const text = String(noteString).toLowerCase();
  const minMatch = text.match(/(\d+)\s*(?:min|minute)/);
  if (minMatch) return parseInt(minMatch[1], 10) * 60;
  const secMatch = text.match(/(\d+)\s*(?:sec|second)/);
  if (secMatch) return parseInt(secMatch[1], 10);
  return 60;
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function WorkoutView({ workout, onBack, onComplete, onStartRecovery }) {
  const { saveExerciseLog, getLastLog, isDeloadWeek, unlockedBadges } = useProgress();
  const { unit, convert, toggleUnits, label } = useUnit();
  const haptics = useHaptics();

  const [restTimer, setRestTimer] = useState(null);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [warmupRoutine, setWarmupRoutine] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sweatTimer, setSweatTimer] = useState(null);
  const [showMoodLogger, setShowMoodLogger] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const wakeLock = useRef(null);

  // sessionData: { [exerciseIndex]: [ { weight, reps, completed } ] }
  const [sessionData, setSessionData] = useState(() => {
    const d = {};
    (workout?.exercises || []).forEach((ex, index) => {
      const setCount = parseInt(ex.sets, 10) || 3;
      const targetReps = parseInt(String(ex.reps), 10) || 10;
      d[index] = Array.from({ length: setCount }, () => ({ weight: '', reps: targetReps, completed: false }));
    });
    return d;
  });

  const { activeToast, clearToast } = useLiveAchievementTracker(sessionData, unlockedBadges);
  const [expandedExercises, setExpandedExercises] = useState(() => {
    const e = {};
    (workout?.exercises || []).forEach((_, index) => { e[index] = true; });
    return e;
  });

  useEffect(() => {
    let lock = null;
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then((l) => { lock = l; wakeLock.current = l; }).catch(() => {});
    }
    return () => { lock?.release?.(); wakeLock.current = null; };
  }, []);

  useEffect(() => {
    if (restTimer === null) return;
    if (restTimer === 0) {
      playBeep('normal');
      haptics.heavy();
      setRestTimer(null);
      return;
    }
    const interval = setInterval(() => setRestTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [restTimer]);

  useEffect(() => {
    if (sweatTimer == null || sweatTimer <= 0) return;
    const interval = setInterval(() => setSweatTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, [sweatTimer]);

  const handleSetChange = (exIndex, setIndex, field, value) => {
    setSessionData((prev) => {
      const exSets = [...(prev[exIndex] || [])];
      exSets[setIndex] = { ...exSets[setIndex], [field]: value };

      if (field === 'weight' && value) {
        for (let i = setIndex + 1; i < exSets.length; i++) {
          if (!exSets[i].weight) exSets[i] = { ...exSets[i], weight: value };
        }
      }
      return { ...prev, [exIndex]: exSets };
    });
  };

  const toggleSetComplete = (exIndex, setIndex) => {
    haptics.medium();
    setSessionData((prev) => {
      const exSets = [...(prev[exIndex] || [])];
      const isCompleting = !exSets[setIndex].completed;
      exSets[setIndex] = { ...exSets[setIndex], completed: isCompleting };

      // Auto-timer: trigger immediately when ANY set is completed
      if (isCompleting) {
        const recommendedRest = getRestTime(workout.exercises[exIndex]?.notes);
        setRestTimer(recommendedRest);
        // Track current exercise for rest timer preview
        setCurrentExerciseIndex(exIndex);
      }
      return { ...prev, [exIndex]: exSets };
    });
  };

  const toggleExpand = (index) => {
    setExpandedExercises((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const finishExercise = (exIndex) => {
    const ex = workout.exercises[exIndex];
    const sets = sessionData[exIndex] || [];
    const validSets = sets.filter((s) => s.weight || s.completed);
    if (validSets.length > 0) {
      saveExerciseLog(ex.name, validSets, unit);
      haptics.light();
      setExpandedExercises((prev) => ({ ...prev, [exIndex]: false }));
    }
  };

  const handleFinishWorkout = (skipCooldown = false, mood = null) => {
    if (workout.type === 'office') {
      haptics.success();
      confetti({ particleCount: 150, spread: 70, colors: ['#FCD34D', '#FFFFFF'] });
      onComplete(workout, null, sessionData);
      return;
    }
    
    // Show mood logger first if no mood selected yet
    if (!mood && !showMoodLogger) {
      setShowMoodLogger(true);
      return;
    }

    if (skipCooldown || isCoolingDown) {
      haptics.success();
      confetti({ particleCount: 150, spread: 70, colors: ['#FCD34D', '#FFFFFF'] });
      onComplete(workout, mood, sessionData);
      return;
    }
    setIsCoolingDown(true);
  };

  const handleMoodSelect = (mood) => {
    setShowMoodLogger(false);
    haptics.medium();
    setIsCoolingDown(true);
    // Store mood for when workout completes
    sessionDataRef.current = { ...sessionData, selectedMood: mood };
  };

  // Store session data ref for mood completion
  const sessionDataRef = useRef(sessionData);

  const formatLastLog = (log) => {
    if (!log) return null;
    if (log.sets && Array.isArray(log.sets)) {
      const max = Math.max(...log.sets.map((s) => parseFloat(s.weight || 0)), 0);
      return max ? `${convert(max)} ${label}` : null;
    }
    return `${convert(log.weight)} ${label}`;
  };

  // --- MOOD LOGGER VIEW ---
  if (showMoodLogger) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
        <button onClick={() => setShowMoodLogger(false)} className="absolute top-6 left-6 text-zinc-500 hover:text-white z-10" aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-500 via-blue-500 to-red-500" />
        <MoodLogger onSelect={handleMoodSelect} />
      </div>
    );
  }

  // --- COOLDOWN VIEW ---
  if (isCoolingDown) {
    const selectedMood = sessionDataRef.current?.selectedMood || null;
    
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <button onClick={onBack} className="absolute top-6 left-6 text-zinc-500 hover:text-white z-10" aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 to-teal-400" />
        <div className="z-10 space-y-8 max-w-sm w-full">
          <h1 className="text-4xl font-black italic text-white tracking-tighter">
            GREAT <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-teal-400">WORK!</span>
          </h1>
          
          {/* Display selected mood */}
          {selectedMood && (
            <div className={`text-center py-3 px-4 rounded-2xl border ${
              selectedMood === 'easy' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
              selectedMood === 'perfect' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
              'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-widest">Session Logged as: {selectedMood}</span>
            </div>
          )}
          
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Sweat Check</span>
              {sweatTimer === null ? (
                <button
                  type="button"
                  onClick={() => setSweatTimer(300)}
                  className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full hover:bg-blue-500/20"
                >
                  Start Timer
                </button>
              ) : (
                <span className="font-mono text-xl font-bold text-white">{formatTime(sweatTimer)}</span>
              )}
            </div>
            <p className="text-xs text-zinc-500 text-left">
              &ldquo;Don&apos;t jump into the shower while sweating… you&apos;ll look like you just came in from the rain.&rdquo;
            </p>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onStartRecovery?.()}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 active:scale-95 transition-all"
            >
              START RECOVERY ROUTINE
            </button>
            <button
              type="button"
              onClick={() => handleFinishWorkout(true, selectedMood)}
              className="w-full bg-zinc-900 text-zinc-500 font-bold py-4 rounded-xl border border-zinc-700 hover:bg-zinc-800 active:scale-95 transition-all"
            >
              SKIP &amp; FINISH
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- WARM-UP VIEW ---
  if (isWarmingUp && warmupRoutine) {
    return (
      <div className="min-h-screen bg-black p-6 pb-24 relative">
        <button
          type="button"
          onClick={onBack}
          className="absolute top-6 left-6 p-2 text-zinc-500 hover:text-white z-10"
          aria-label="Go back"
        >
          <ArrowLeft size={24} aria-hidden />
        </button>
        <h2 className="text-2xl font-black text-orange-500 italic uppercase mb-2 pt-12">
          {warmupRoutine.title}
        </h2>
        <p className="text-zinc-400 text-sm mb-6">{warmupRoutine.description}</p>

        <div className="space-y-4">
          {warmupRoutine.exercises.map((ex, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
              <h3 className="font-bold text-white text-lg">{ex.name}</h3>
              <p className="text-xs text-blue-400 uppercase font-bold mb-2">
                Targets: {ex.targets}
              </p>
              <ul className="list-disc pl-4 space-y-1">
                {ex.steps.map((step, s) => (
                  <li key={s} className="text-sm text-zinc-300">
                    {step}
                  </li>
                ))}
              </ul>
              {ex.tips && (
                <p className="text-xs text-orange-400/90 mt-2 italic">&ldquo;{ex.tips}&rdquo;</p>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsWarmingUp(false)}
          className="fixed bottom-6 left-6 right-6 max-w-md mx-auto bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all"
        >
          WARM UP COMPLETE - START WORKOUT
        </button>
      </div>
    );
  }

  // --- STANDARD SET-TRACKER VIEW ---
  const totalSets = Object.values(sessionData).flat().length || 1;
  const completedSetsCount = Object.values(sessionData).flat().filter((s) => s?.completed).length;
  const progress = totalSets > 0 ? (completedSetsCount / totalSets) * 100 : 0;

  return (
    <div className="min-h-screen bg-black pb-32 relative">
      <div className="sticky top-0 bg-black/90 backdrop-blur-xl border-b border-zinc-800 p-4 z-40 flex items-center justify-between">
        <button type="button" onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white" aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
        <button
          type="button"
          onClick={toggleUnits}
          className="flex items-center gap-1 bg-zinc-800 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white text-xs font-bold uppercase"
          aria-label={`Weight unit: ${unit}`}
        >
          <Scale size={12} /> {unit}
        </button>
      </div>

      <div className="h-1 bg-zinc-900 w-full">
        <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="p-4 space-y-4">
        {!isWarmingUp && !warmupRoutine && (
          <button
            type="button"
            onClick={() => {
              setWarmupRoutine(warmups.find((w) => w.id === 'microwave'));
              setIsWarmingUp(true);
            }}
            className="w-full mb-4 flex items-center justify-center gap-2 bg-orange-600/20 text-orange-500 border border-orange-600/50 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-orange-600 hover:text-white transition-all"
          >
            <Flame size={18} aria-hidden /> Start &ldquo;The Microwave&rdquo; Warm Up
          </button>
        )}
        {workout.exercises.map((ex, i) => {
          const sets = sessionData[i] || [];
          const isExpanded = expandedExercises[i] !== false;
          const isComplete = sets.length > 0 && sets.every((s) => s.completed);
          const lastLog = getLastLog(ex.name);

          return (
            <div
              key={i}
              className={`bg-zinc-900/30 border rounded-xl overflow-hidden transition-all ${
                isComplete ? 'border-green-900/30' : 'border-zinc-800/50'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleExpand(i)}
                className="w-full p-4 flex items-center justify-between cursor-pointer active:bg-zinc-800/50 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold text-base truncate ${isComplete ? 'text-green-500' : 'text-white'}`}>
                      {ex.name}
                    </h4>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExercise(ex.name);
                      }}
                      className="text-zinc-500 hover:text-blue-400 p-1 shrink-0"
                      aria-label={`View demo for ${ex.name}`}
                    >
                      <Info size={16} aria-hidden />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {sets.length} SETS × {ex.reps} REPS
                    </span>
                    {lastLog && formatLastLog(lastLog) && (
                      <span className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
                        <History size={10} /> {formatLastLog(lastLog)}
                      </span>
                    )}
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={16} className="text-zinc-600 shrink-0" /> : <ChevronDown size={16} className="text-zinc-600 shrink-0" />}
              </button>

              {isExpanded && (
                <div className="bg-black/20 border-t border-zinc-800/50">
                  <div className="grid grid-cols-[1fr_2fr_2fr_1fr] gap-2 px-4 py-2 text-[10px] uppercase font-bold text-zinc-600 border-b border-zinc-800/50">
                    <div className="text-center">Set</div>
                    <div className="text-center flex items-center justify-center gap-1">
                      {label}
                      {isDeloadWeek && (
                        <span className="bg-yellow-500/20 text-yellow-500 text-[6px] px-1 rounded">-50%</span>
                      )}
                    </div>
                    <div className="text-center">Reps</div>
                    <div className="text-center">Done</div>
                  </div>

                  {sets.map((set, setIdx) => (
                    <div
                      key={setIdx}
                      className={`grid grid-cols-[1fr_2fr_2fr_1fr] gap-2 px-4 py-3 items-center border-b border-zinc-800/30 last:border-b-0 ${
                        set.completed ? 'bg-green-900/10' : ''
                      }`}
                    >
                      <div className="flex justify-center">
                        <span
                          className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                            set.completed ? 'bg-green-500/20 text-green-500' : 'bg-zinc-800 text-zinc-500'
                          }`}
                        >
                          {setIdx + 1}
                        </span>
                      </div>
                      <div>
                        <input
                          type="number"
                          inputMode="decimal"
                          placeholder="-"
                          value={set.weight}
                          onChange={(e) => handleSetChange(i, setIdx, 'weight', e.target.value)}
                          className={`w-full bg-zinc-900 border rounded p-2 text-center text-sm font-mono focus:border-yellow-500 outline-none transition-colors ${
                            set.completed ? 'border-green-900 text-green-400' : 'border-zinc-700 text-white'
                          }`}
                          aria-label={`Set ${setIdx + 1} weight`}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          inputMode="numeric"
                          placeholder={String(ex.reps)}
                          value={set.reps}
                          onChange={(e) => handleSetChange(i, setIdx, 'reps', e.target.value)}
                          className={`w-full bg-zinc-900 border rounded p-2 text-center text-sm font-mono focus:border-yellow-500 outline-none transition-colors ${
                            set.completed ? 'border-green-900 text-green-400' : 'border-zinc-700 text-white'
                          }`}
                          aria-label={`Set ${setIdx + 1} reps`}
                        />
                      </div>
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => toggleSetComplete(i, setIdx)}
                          className={`p-2 rounded-lg transition-all active:scale-90 ${
                            set.completed ? 'text-green-500 bg-green-500/10' : 'text-zinc-600 hover:bg-zinc-800'
                          }`}
                          aria-label={set.completed ? `Set ${setIdx + 1} completed` : `Mark set ${setIdx + 1} complete`}
                        >
                          {set.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => finishExercise(i)}
                      className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
                        isComplete ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      <Save size={14} /> {isComplete ? 'Exercise Complete' : 'Save Progress'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ENHANCED REST TIMER OVERLAY */}
      {restTimer !== null && restTimer > 0 && (
        <div className="fixed inset-0 z-100 bg-blue-600 animate-in fade-in duration-300 flex flex-col items-center justify-center p-8 overflow-hidden">
          {/* Progress Background (Visual Pulse) */}
          <div className="absolute inset-0 bg-blue-700/50 animate-pulse" />

          {/* The Timer */}
          <div className="relative z-10 text-center mb-12">
            <p className="text-white/40 font-black italic uppercase tracking-[0.3em] text-xs mb-2">Resting</p>
            <h2 className="text-9xl font-black text-white italic tracking-tighter drop-shadow-2xl">
              {restTimer}
            </h2>
          </div>

          {/* NEXT EXERCISE PREVIEW */}
          {currentExerciseIndex < workout.exercises.length - 1 ? (
            <div className="relative z-10 w-full max-w-sm bg-black/30 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-2 rounded-xl">
                  <ArrowRight className="text-white" size={20} />
                </div>
                <p className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Prepare for Next Move</p>
              </div>

              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">
                {workout.exercises[currentExerciseIndex + 1].name}
              </h3>

              {/* Dynamic Tip from Exercise Library */}
              <div className="flex gap-3 items-start bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="text-blue-300 mt-0.5 shrink-0"><Zap size={16} /></div>
                <p className="text-xs text-blue-100 leading-relaxed italic">
                  "{getExerciseDetails(workout.exercises[currentExerciseIndex + 1].name).tips}"
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {getExerciseDetails(workout.exercises[currentExerciseIndex + 1].name).targets.split(',').map(tag => (
                  <span key={tag} className="text-[8px] bg-white/10 text-white/70 px-2 py-1 rounded-md font-bold uppercase">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative z-10 text-center text-white/80 font-black italic uppercase">
              Final Set! Give it everything.
            </div>
          )}

          {/* Skip Button */}
          <button 
            type="button"
            onClick={() => setRestTimer(null)}
            className="relative z-10 mt-12 text-white/40 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors border-b border-white/20 pb-1"
          >
            Skip Rest & Start
          </button>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black via-black/90 to-transparent z-50">
        <div className="max-w-md mx-auto space-y-2">
          <button
            type="button"
            onClick={() => handleFinishWorkout()}
            className="w-full bg-yellow-500 text-black font-black italic tracking-wider py-4 rounded-xl shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 active:scale-95 transition-all"
          >
            COMPLETE WORKOUT
          </button>
        </div>
      </div>

      {selectedExercise && (
        <ExerciseModal
          exerciseName={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      <IntelToast toast={activeToast} onClear={clearToast} />
    </div>
  );
}
