import { useState } from 'react';
import { ArrowLeft, Plus, Save, Trash2, Dumbbell } from 'lucide-react';
import { workouts } from '../data/workouts';

const masterExerciseList = Array.from(
  new Set(workouts.flatMap((w) => w.exercises.map((e) => e.name)))
).sort();

export default function CreateView({ onBack, onSave }) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('30');
  const [exercises, setExercises] = useState([]);

  const [selectedName, setSelectedName] = useState(masterExerciseList[0] || '');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [notes, setNotes] = useState('');

  const addExercise = () => {
    const newEx = { name: selectedName, sets, reps, notes };
    setExercises([...exercises, newEx]);
    setNotes('');
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title || exercises.length === 0) return;

    const newWorkout = {
      id: `custom-${Date.now()}`,
      title,
      duration: parseInt(duration, 10),
      type: 'custom',
      difficulty: 'Custom',
      exercises: [...exercises]
    };

    onSave(newWorkout);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft />
        </button>
        <h2 className="text-2xl font-black italic tracking-tighter text-white">
          BUILD <span className="text-yellow-500">ROUTINE</span>
        </h2>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        {/* --- 1. DETAILS --- */}
        <div className="space-y-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
          <div>
            <label className="text-xs font-bold uppercase text-zinc-500 block mb-1">
              Routine Name
            </label>
            <input
              type="text"
              placeholder="e.g. Chest & Back Destroyer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-600 focus:border-yellow-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-zinc-500 block mb-1">
              Duration (Est. Minutes)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
            >
              {[10, 15, 20, 30, 45, 60, 90].map((m) => (
                <option key={m} value={m}>
                  {m} Minutes
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* --- 2. ADD EXERCISES --- */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Dumbbell size={18} className="text-blue-500" /> Add Exercise
          </h3>

          <select
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-yellow-500 outline-none"
          >
            {masterExerciseList.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase text-zinc-500">Sets</label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded p-2 text-sm text-white focus:border-yellow-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-zinc-500">Reps</label>
              <input
                type="text"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="e.g. 10 or 8-12"
                className="w-full bg-black border border-zinc-700 rounded p-2 text-sm text-white focus:border-yellow-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase text-zinc-500">
              Notes (Rest time, etc)
            </label>
            <input
              type="text"
              placeholder="e.g. 60 sec rest, heavy weight"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded p-2 text-sm text-white placeholder-zinc-600 focus:border-yellow-500 outline-none"
            />
          </div>

          <button
            onClick={addExercise}
            className="w-full bg-zinc-800 text-zinc-300 font-bold py-3 rounded-lg hover:bg-zinc-700 hover:text-white flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={16} /> Add to List
          </button>
        </div>

        {/* --- 3. PREVIEW LIST --- */}
        <div className="space-y-2">
          {exercises.map((ex, i) => (
            <div
              key={i}
              className="bg-zinc-900/30 border border-zinc-800 p-3 rounded-lg flex justify-between items-center group"
            >
              <div>
                <p className="font-bold text-sm text-white">{ex.name}</p>
                <p className="text-xs text-zinc-500">
                  {ex.sets} x {ex.reps} {ex.notes ? `• ${ex.notes}` : ''}
                </p>
              </div>
              <button
                onClick={() => removeExercise(i)}
                className="text-zinc-600 hover:text-red-500 transition-colors p-1"
                aria-label="Remove exercise"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* --- SAVE BUTTON --- */}
        <button
          onClick={handleSave}
          disabled={!title || exercises.length === 0}
          className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl shadow-lg shadow-yellow-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save size={20} /> SAVE ROUTINE
        </button>
      </div>
    </div>
  );
}
