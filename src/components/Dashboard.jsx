import { useState } from 'react';
import { workouts } from '../data/workouts';
import { skillTree } from '../data/skills';
import { Trophy, Clock, Plane, Lock, Plus, Trash2, Flame } from 'lucide-react';
import { getRank, getRankColor } from '../utils/ranks';
import DailyBrief from './DailyBrief';
import CoachChat from './CoachChat';

export default function Dashboard({
  xp,
  level,
  streak,
  profile,
  customWorkouts,
  onSelectWorkout,
  onShowCreate,
  onShowLeaderboard,
  onDeleteCustomWorkout,
  // New intelligent features props
  history,
  foodLogs,
  pendingNotifications,
  onClearNotification,
  onViewStats,
  bests,
}) {
  const [filterDuration, setFilterDuration] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [travelMode, setTravelMode] = useState(false);

  // Merge static book workouts with user custom workouts
  const allWorkouts = [...workouts, ...(customWorkouts || [])];

  // Filter Logic
  const filteredWorkouts = allWorkouts.filter((w) => {
    if (w.type === 'office') return false;
    if (travelMode && w.type !== 'weightless') return false;
    if (filterType !== 'all' && w.type !== filterType) return false;
    const durationMatch = filterDuration === 'all' || w.duration === parseInt(filterDuration, 10);
    return durationMatch;
  });

  const xpForNextLevel = 500;
  const currentLevelXp = xp % 500;
  const progressPercent = (currentLevelXp / xpForNextLevel) * 100;

  return (
    <div className="p-6 max-w-md mx-auto space-y-8">
      {/* HEADER */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-black italic tracking-tighter text-white">
            LVL UP <span className="text-yellow-500">FITNESS</span>
          </h1>
        </div>

        {/* Stats Card — tap to open Global Rankings */}
        <div
          onClick={onShowLeaderboard}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onShowLeaderboard?.(); } }}
          className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-lg relative overflow-hidden group cursor-pointer hover:border-yellow-500/50 transition-all active:scale-95"
          aria-label="View global rankings"
        >
          <div className="absolute top-2 right-2 text-zinc-600 group-hover:text-yellow-500 transition-colors z-10">
            <Trophy size={16} />
          </div>
          <div className="flex justify-between items-end mb-2 relative z-10">
            <div>
              {profile && (
                <div className="inline-flex items-center gap-1 bg-zinc-800 px-2 py-0.5 rounded text-[10px] text-zinc-400 mb-1 border border-zinc-700">
                  <span className="text-yellow-500">●</span> {profile.title}
                </div>
              )}
              <p className={`text-xs font-black uppercase tracking-widest mb-1 ${getRankColor(level)}`}>
                {getRank(level)}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white leading-none">LVL {level}</p>
                <p className="text-xs text-zinc-500 font-mono">/ 50</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-orange-500 mb-1 justify-end">
                <Flame size={14} fill="currentColor" />
                <span className="font-bold">{streak}</span>
              </div>
              <p className="text-[10px] text-zinc-500 uppercase">Day Streak</p>
            </div>
          </div>
          <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden z-10">
            <div
              className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-600 to-purple-500 transition-all duration-1000"
              style={{ width: `${((xp % 500) / 500) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 z-10 relative">
            <p className="text-[10px] text-zinc-500">{xp % 500} / 500 XP</p>
            <p className="text-[10px] text-zinc-500">To Lvl {level + 1}</p>
          </div>
          <Trophy className="absolute -bottom-4 -right-4 w-32 h-32 text-zinc-800/20 rotate-12 pointer-events-none" />
        </div>
      </div>

      {/* DAILY BRIEF - Coach's Corner */}
      <DailyBrief 
        profile={profile}
        history={history}
        foodLogs={foodLogs}
        pendingNotifications={pendingNotifications}
        onClearNotification={onClearNotification}
        onAction={onViewStats}
      />

      {/* AI COACH CHAT */}
      <CoachChat 
        userData={{ 
          profile, 
          history, 
          foodLogs, 
          streak, 
          bests, 
          level, 
          isDeloadWeek: profile?.isDeloadWeek 
        }} 
      />

      {/* FILTERS */}
      <div className="space-y-3">
        <button
          onClick={onShowCreate}
          className="w-full mb-2 py-2 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase rounded-lg hover:text-white hover:border-zinc-500 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={14} /> Create New Routine
        </button>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['all', 'weight', 'weightless', 'interval', 'sports', 'custom'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all
                ${filterType === type
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
            >
              {type === 'all' ? 'All' : type === 'sports' ? 'Sports Perf' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['all', '10', '15', '20', '30', '45', '60', '90'].map((time) => (
            <button
              key={time}
              onClick={() => setFilterDuration(time)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors
                ${filterDuration === time ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
            >
              {time === 'all' ? 'All' : `${time}m`}
            </button>
          ))}
        </div>

        {/* Travel Mode Toggle */}
        <button
          onClick={() => setTravelMode(!travelMode)}
          className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-2 transition-all
            ${travelMode
              ? 'bg-blue-900/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
        >
          <Plane size={16} />
          {travelMode ? 'Travel Mode Active (Weightless Only)' : 'Activate Travel Mode'}
        </button>
      </div>

      {/* WORKOUT LIST */}
      <div className="space-y-4">
        {filteredWorkouts.map(workout => {
          const unlockingNode = skillTree.find(node => node.unlocks.includes(workout.id));
          const isLocked = unlockingNode ? xp < unlockingNode.requiredXp : false;

          return (
            <div
              key={workout.id}
              onClick={() => !isLocked && onSelectWorkout(workout)}
              className={`bg-zinc-900 border p-5 rounded-2xl transition-all relative overflow-hidden
                ${isLocked
                  ? 'border-zinc-800 opacity-60 cursor-not-allowed grayscale'
                  : 'border-zinc-800 hover:border-yellow-500/50 cursor-pointer group active:scale-95'}`}
            >
              {workout.type === 'custom' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCustomWorkout(workout.id);
                  }}
                  className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors z-20"
                  aria-label="Delete routine"
                >
                  <Trash2 size={16} />
                </button>
              )}

              {isLocked && (
                <div className="absolute inset-0 bg-black/50 z-20 flex flex-col items-center justify-center text-zinc-400 backdrop-blur-[1px]">
                  <Lock size={24} className="mb-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Unlocks at {unlockingNode.requiredXp} XP
                  </span>
                </div>
              )}

              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                  ${workout.type === 'weight' ? 'bg-blue-900/30 text-blue-400' :
                    workout.type === 'abs' ? 'bg-red-900/30 text-red-400' :
                    workout.type === 'interval' ? 'bg-orange-900/30 text-orange-400' :
                    workout.type === 'sports' ? 'bg-purple-900/30 text-purple-400' :
                    workout.type === 'custom' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-green-900/30 text-green-400'}`}>
                  {workout.type === 'custom' ? 'CUSTOM' : workout.type === 'sports' ? 'SPORTS' : workout.type.toUpperCase()}
                </span>
                <span className="flex items-center gap-1 text-zinc-400 text-xs font-mono">
                  <Clock size={14} /> {workout.duration}m
                </span>
              </div>
              <h3 className="text-xl font-bold text-white leading-tight mb-1 group-hover:text-yellow-400 transition-colors">
                {workout.title.replace('The Ultimate ', '').replace(' Workout', '')}
              </h3>
              <p className="text-zinc-500 text-sm">
                {workout.description || `${workout.exercises.length} Exercises`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
