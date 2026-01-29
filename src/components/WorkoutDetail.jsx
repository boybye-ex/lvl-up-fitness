import { ArrowLeft, Play, Clock, BarChart3, Info } from 'lucide-react';

export default function WorkoutDetail({ workout, onBack, onStart }) {
  if (!workout) return null;

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 pb-24">
      {/* Header Image / Pattern Area */}
      <div className="relative h-48 bg-zinc-900 rounded-3xl mb-6 overflow-hidden border border-zinc-800 flex items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80" />
        <h1 className="relative z-10 text-3xl font-black text-center text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-teal-400 italic uppercase px-4">
          {workout.title}
        </h1>
      </div>

      {/* Meta Data */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-2xl text-center">
          <Clock className="w-5 h-5 text-zinc-500 mx-auto mb-1" />
          <p className="text-xs font-bold text-white">{workout.duration} Min</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-2xl text-center">
          <BarChart3 className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
          <p className="text-xs font-bold text-white">{workout.difficulty || '—'}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-2xl text-center">
          <div className="flex justify-center mb-1">
            <ActivityIcon type={workout.type} />
          </div>
          <p className="text-xs font-bold text-white uppercase">{workout.type}</p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h3 className="text-zinc-500 font-bold uppercase text-xs tracking-wider mb-2">Briefing</h3>
        <p className="text-sm text-zinc-300 leading-relaxed">
          {workout.description || 'No briefing available for this mission.'}
        </p>
      </div>

      {/* Exercise List */}
      <div className="mb-24">
        <h3 className="text-zinc-500 font-bold uppercase text-xs tracking-wider mb-4">Mission Plan</h3>
        <div className="space-y-3">
          {workout.exercises.map((ex, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 shrink-0">
                {i + 1}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{ex.name}</h4>
                <div className="flex gap-2 text-xs text-zinc-500 mt-1">
                  <span>{ex.sets} Sets</span>
                  <span>•</span>
                  <span>{ex.reps} Reps</span>
                </div>
                {ex.notes && (
                  <p className="text-xs text-blue-400 mt-2 italic flex items-start gap-1">
                    <Info size={12} className="shrink-0 mt-0.5" />
                    <span>{ex.notes}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black via-black to-transparent pt-12">
        <div className="max-w-md mx-auto flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-zinc-800 text-white p-4 rounded-xl hover:bg-zinc-700 transition-colors flex items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => onStart(workout)}
            className="flex-1 bg-blue-600 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
          >
            <Play size={20} fill="currentColor" /> START MISSION
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityIcon({ type }) {
  const icons = {
    sports: '🏆',
    weight: '🏋️',
    interval: '⚡',
    abs: '🔥',
    weightless: '🏃',
  };
  return <span className="text-xl" aria-hidden>{icons[type] ?? '🏃'}</span>;
}
