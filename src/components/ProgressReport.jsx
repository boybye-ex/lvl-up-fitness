import { getWeeklyComparison, generateInsight } from '../utils/analytics';

function LegendItem({ color, label, isLine }) {
  return (
    <div className="flex items-center gap-1">
      <div className={`rounded-full ${isLine ? 'w-3 h-0.5' : 'w-2 h-2'} ${color}`} />
      <span className="text-[8px] text-zinc-500 font-bold uppercase">{label}</span>
    </div>
  );
}

export default function ProgressReport({ history, foodLogs, weightLogs, proteinGoal = 150 }) {
  const data = getWeeklyComparison(history, foodLogs, weightLogs);
  const maxIntensity = Math.max(...data.map((d) => d.intensity), 100);
  const maxProtein = Math.max(...data.map((d) => d.protein), 100, proteinGoal * 1.2);

  const getProteinBarClass = (grams) =>
    grams >= proteinGoal ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-orange-500';

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl mb-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-white font-black italic uppercase text-lg tracking-tighter">Weekly Sync</h3>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Intensity vs. Repair</p>
        </div>
        <div className="flex gap-4">
          <LegendItem color="bg-blue-500" label="Work" />
          <LegendItem color="bg-orange-500" label="Fuel" />
        </div>
      </div>

      <div className="flex justify-between items-end h-32 gap-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full flex justify-center items-end gap-0.5 h-full">
              <div
                className="w-2 bg-blue-500 rounded-t-sm transition-all duration-700"
                style={{ height: `${(d.intensity / maxIntensity) * 100}%` }}
              />
              <div
                className={`w-2 rounded-t-sm transition-all duration-700 ${getProteinBarClass(d.protein)}`}
                style={{ height: `${(d.protein / maxProtein) * 100}%` }}
              />
            </div>
            <span className="text-[9px] font-bold text-zinc-600 uppercase mt-2">{d.day}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-800">
        <p className="text-[10px] text-zinc-400 italic leading-relaxed">{generateInsight(data, proteinGoal)}</p>
      </div>
    </div>
  );
}
