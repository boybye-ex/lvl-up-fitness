import { useMemo } from 'react';

export default function CalendarHeatmap({ history, type = 'train' }) {
  const isFuel = type === 'fuel';

  const { calendarData, firstDayOffset } = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = new Date(year, month, i).toISOString().split('T')[0];

      if (isFuel) {
        const dayEntries = (history || []).filter((f) => f.timestamp && f.timestamp.startsWith(dateStr));
        const count = dayEntries.length;
        const totalCal = dayEntries.reduce((sum, f) => sum + (parseFloat(f.calories) || 0), 0);
        let intensity = 'bg-zinc-800 border-zinc-700/50';
        if (count > 0) intensity = 'bg-orange-900/40 border-orange-900';
        if (totalCal > 500) intensity = 'bg-orange-600/60 border-orange-600';
        if (totalCal > 1000) intensity = 'bg-orange-500 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]';
        days.push({ day: i, intensity, count, date: dateStr });
      } else {
        const daysWorkouts = (history || []).filter((h) => h.timestamp && h.timestamp.startsWith(dateStr));
        const totalXp = daysWorkouts.reduce((sum, w) => sum + (w.xpEarned || 0), 0);
        let intensity = 'bg-zinc-800 border-zinc-700/50';
        if (totalXp > 0) intensity = 'bg-green-900/40 border-green-900';
        if (totalXp > 100) intensity = 'bg-green-600/60 border-green-600';
        if (totalXp > 300) intensity = 'bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]';
        days.push({ day: i, intensity, count: daysWorkouts.length, date: dateStr });
      }
    }
    return { calendarData: days, firstDayOffset: firstDay };
  }, [history, isFuel]);

  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const label = isFuel ? 'meal' : 'Workout';

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl mb-6">
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-zinc-400 font-bold uppercase text-xs tracking-widest">
          {currentMonthName} {isFuel ? 'Nutrition' : 'Activity'}
        </h3>
        <span className="text-[10px] text-zinc-600 uppercase">Consistency is Key</span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] text-zinc-600 font-bold mb-1">
            {d}
          </div>
        ))}

        {Array.from({ length: firstDayOffset }, (_, i) => (
          <div key={`pad-${i}`} className="aspect-square rounded-md border border-transparent bg-transparent" aria-hidden />
        ))}

        {calendarData.map((d) => (
          <div
            key={d.day}
            className={`aspect-square rounded-md border ${d.intensity} flex items-center justify-center relative group transition-all duration-500`}
          >
            <span className={`text-[10px] ${d.count > 0 ? 'text-white font-bold' : 'text-zinc-700'}`}>
              {d.day}
            </span>
            {d.count > 0 && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black border border-zinc-700 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {d.count} {label}{d.count !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
