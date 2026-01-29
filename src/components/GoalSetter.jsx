import { useState } from 'react';
import { Target, Edit2, Sparkles, Scale } from 'lucide-react';
import { calculateSuggestedProtein } from '../utils/nutritionMath';
import { useHaptics } from '../hooks/useHaptics';

export default function GoalSetter({ currentGoal, onUpdate, userWeight, weightUnit, workoutHistory }) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(currentGoal ?? 150);
  const [isCalculating, setIsCalculating] = useState(false);
  const haptics = useHaptics();

  const goal = currentGoal ?? 150;

  const runSmartCalc = () => {
    setIsCalculating(true);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentWorkouts = (workoutHistory || []).filter((h) => new Date(h.timestamp) > weekAgo).length;

    let intensity = 'low';
    if (recentWorkouts >= 5) intensity = 'high';
    else if (recentWorkouts >= 3) intensity = 'moderate';

    const suggestion = calculateSuggestedProtein(userWeight || 180, weightUnit || 'lbs', intensity);

    setTimeout(() => {
      onUpdate(suggestion);
      setVal(suggestion);
      setIsCalculating(false);
      haptics.success?.();
    }, 800);
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
            <Target size={20} />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Daily Goal</p>
            {isEditing ? (
              <input
                type="number"
                className="bg-transparent text-xl font-black text-white w-20 outline-none border-b border-orange-500"
                value={val}
                autoFocus
                onBlur={() => {
                  onUpdate(val);
                  setIsEditing(false);
                }}
                onChange={(e) => setVal(Number(e.target.value) || 0)}
              />
            ) : (
              <p className="text-xl font-black text-white">
                {goal}g <span className="text-xs text-zinc-600">Protein</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-zinc-600 hover:text-white transition-colors p-1"
            aria-label="Edit goal"
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            onClick={runSmartCalc}
            disabled={isCalculating}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tighter transition-all ${
              isCalculating
                ? 'bg-zinc-800 text-zinc-500'
                : 'bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600 hover:text-white'
            }`}
          >
            <Sparkles size={14} className={isCalculating ? 'animate-spin' : ''} />
            {isCalculating ? 'Analyzing...' : 'Smart Calc'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-black/40 rounded-xl border border-zinc-800/50">
        <Scale size={12} className="text-zinc-600" />
        <p className="text-[9px] text-zinc-500 font-medium">
          Based on your <span className="text-zinc-300">{userWeight ?? '—'}{weightUnit}</span> frame and recent training volume.
        </p>
      </div>
    </div>
  );
}
