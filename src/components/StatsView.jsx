import { ArrowLeft, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import useUnit from '../hooks/useUnit';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function StatsView({ history, logs, onBack }) {
  const { convert, label } = useUnit();

  const getLast7DaysXP = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const dailyXP = (history || [])
        .filter((h) => h.timestamp.startsWith(dateStr))
        .reduce((sum, h) => sum + (h.xpEarned || 0), 0);

      data.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        xp: dailyXP
      });
    }
    return data;
  };

  const xpData = getLast7DaysXP();

  const getStrengthData = (exerciseName) => {
    if (!logs || !logs[exerciseName]) return [];

    return [...logs[exerciseName]]
      .reverse()
      .map((entry) => ({
        date: new Date(entry.date).toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric'
        }),
        weight: convert(entry.weight)
      }));
  };

  const availableLogs = logs ? Object.keys(logs) : [];
  const featuredExercise = availableLogs.includes('Bench Press')
    ? 'Bench Press'
    : availableLogs[0];
  const strengthData = featuredExercise ? getStrengthData(featuredExercise) : [];

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
          PERFORMANCE <span className="text-yellow-500">STATS</span>
        </h2>
      </div>

      <div className="space-y-8">
        {/* --- XP CHART --- */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-4 text-yellow-500">
            <Activity size={20} />
            <h3 className="font-bold uppercase tracking-wider text-sm">
              Weekly Activity (XP)
            </h3>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={xpData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#333"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#eab308' }}
                  cursor={{ fill: '#27272a' }}
                />
                <Bar dataKey="xp" fill="#eab308" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- STRENGTH CHART --- */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <TrendingUp size={20} />
            <h3 className="font-bold uppercase tracking-wider text-sm">
              Strength Progress ({label}): {featuredExercise || 'No Data'}
            </h3>
          </div>

          {strengthData.length > 1 ? (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={strengthData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#333"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#71717a', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fill: '#71717a', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#27272a',
                      color: '#fff'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#60a5fa"
                    strokeWidth={3}
                    dot={{ fill: '#60a5fa', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center text-zinc-500 text-sm italic border-2 border-dashed border-zinc-800 rounded-xl">
              <p>Log weights during a workout</p>
              <p>to see your strength curve here.</p>
            </div>
          )}
        </div>

        {/* --- INSIGHTS --- */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2 text-zinc-400">
            <BarChart3 size={16} />
            <span className="text-xs font-bold uppercase">Analysis</span>
          </div>
          <p className="text-zinc-500 text-xs leading-relaxed">
            &ldquo;Chart your progress... a log will help remind you where
            you&apos;ve been and where you&apos;re going.&rdquo; <br />—{' '}
            <em>Stronger Faster</em>
          </p>
        </div>
      </div>
    </div>
  );
}
