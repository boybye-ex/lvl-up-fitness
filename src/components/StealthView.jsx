import { ArrowLeft } from 'lucide-react';
import { workouts } from '../data/workouts';

export default function StealthView({ onBack, onComplete }) {
  const workout = workouts.find(w => w.id === 'office-stealth');

  if (!workout) return null;

  return (
    <div className="min-h-screen bg-white text-black p-8 font-serif">
      {/* "Fake" Header to look like a doc */}
      <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest">Quarterly Productivity Report</h1>
          <p className="text-xs text-gray-500 mt-1">CONFIDENTIAL - INTERNAL USE ONLY</p>
        </div>
        <button onClick={onBack} className="text-xs underline text-gray-400 hover:text-black">Close Document</button>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        <p className="text-sm leading-relaxed">
          Please review the following action items for Q3 optimization. Ensure all steps are completed at your desk to maintain workflow efficiency.
        </p>

        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 font-bold">Action Item (Exercise)</th>
              <th className="py-2 font-bold">Volume (Reps)</th>
              <th className="py-2 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {workout.exercises.map((ex, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3">{ex.name}</td>
                <td className="py-3">{ex.sets} x {ex.reps}</td>
                <td className="py-3">
                  <input type="checkbox" className="w-4 h-4 border-2 border-gray-400 rounded focus:ring-0 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pt-8 border-t border-gray-200">
          <button
            onClick={() => onComplete(workout)}
            className="text-xs bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 border border-gray-300"
          >
            Submit Report (Finish Workout)
          </button>
        </div>
      </div>
    </div>
  );
}
