import { useState } from 'react';
import { ArrowLeft, CalendarDays, TrendingUp, Trophy, Plus, Utensils, Apple, Zap, Flame, ChevronRight } from 'lucide-react';
import CalendarHeatmap from './CalendarHeatmap';
import FoodLogger from './FoodLogger';
import ProgressReport from './ProgressReport';
import GoalSetter from './GoalSetter';
import WeightLogger from './WeightLogger';
import PhotoVault from './PhotoVault';
import EvolutionView from './EvolutionView';
import MissionDebrief from './MissionDebrief';
import useProgress from '../hooks/useProgress';

function calculateDailyProtein(foodLogs) {
  const today = new Date().toISOString().split('T')[0];
  return (foodLogs || []).reduce((sum, f) => {
    if (f.timestamp && f.timestamp.startsWith(today)) return sum + (parseFloat(f.protein) || 0);
    return sum;
  }, 0);
}

function calculateTotalCalories(foodLogs) {
  return (foodLogs || []).reduce((sum, f) => sum + (parseFloat(f.calories) || 0), 0);
}

export default function HistoryView({ history, streak, onBack }) {
  const {
    foodLogs,
    logFood,
    weightLogs,
    photoLogs,
    profile,
    updateGoal,
    logWeight,
    savePhoto,
    deletePhoto,
    togglePrivacy,
    settings,
  } = useProgress();
  const [subTab, setSubTab] = useState('train');
  const [showLogger, setShowLogger] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const isFuel = subTab === 'fuel';
  const proteinGoal = profile?.dailyProteinGoal ?? 150;
  const userWeight = profile?.weight ?? null;
  const weightUnit = profile?.unit || 'lbs';
  const isPrivacyMode = settings?.isPrivacyMode ?? true;

  const sortedHistory = [...(history || [])].sort(
    (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
  );

  const sortedFoodLogs = [...(foodLogs || [])].sort(
    (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
  );

  const dailyProtein = calculateDailyProtein(foodLogs);
  const totalCalories = calculateTotalCalories(foodLogs);
  const frontPhotos = (photoLogs || []).filter((p) => p.side === 'front');
  const showEvolution = frontPhotos.length >= 2;

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        {onBack && (
          <button type="button" onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white" aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
        )}
        <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">
          {isFuel ? 'Nutrition' : 'Training'} <span className="text-blue-500">Log</span>
        </h2>
      </div>

      <CalendarHeatmap history={isFuel ? foodLogs || [] : history || []} type={subTab} />

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-orange-500 mb-1">
            {isFuel ? <Zap size={16} /> : <TrendingUp size={16} />}
            <span className="text-xs font-bold uppercase">{isFuel ? 'Protein' : 'Streak'}</span>
          </div>
          <p className="text-2xl font-black text-white">
            {isFuel ? dailyProtein : (streak ?? 0)}
            <span className="text-sm font-normal text-zinc-500">{isFuel ? ' g' : ' Days'}</span>
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-yellow-500 mb-1">
            <Flame size={16} />
            <span className="text-xs font-bold uppercase">Total</span>
          </div>
          <p className="text-2xl font-black text-white">
            {isFuel ? totalCalories : (history || []).length}
            <span className="text-sm font-normal text-zinc-500">{isFuel ? ' Cal' : ' Sessions'}</span>
          </p>
        </div>
      </div>

      {/* Sub-Tab Toggle */}
      <div className="flex bg-zinc-900 rounded-xl p-1 mb-6">
        <button
          type="button"
          onClick={() => setSubTab('train')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            subTab === 'train' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500'
          }`}
        >
          WORKOUTS
        </button>
        <button
          type="button"
          onClick={() => setSubTab('fuel')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            subTab === 'fuel' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500'
          }`}
        >
          NUTRITION
        </button>
      </div>

      {subTab === 'train' ? (
        <>
          <h3 className="text-zinc-500 font-bold uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
            <CalendarDays size={14} /> Recent Activity
          </h3>

          <div className="space-y-3">
            {sortedHistory.length === 0 ? (
              <div className="text-center py-10 text-zinc-600 italic">
                No combat records found. <br /> Start your first mission.
              </div>
            ) : (
              sortedHistory.map((entry, i) => (
                <button
                  key={entry.timestamp ? `${entry.timestamp}-${i}` : i}
                  onClick={() => setSelectedWorkout(entry)}
                  className="w-full bg-zinc-900/30 border border-zinc-800 p-4 rounded-xl flex justify-between items-center hover:bg-zinc-800/50 transition-all group active:scale-95 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-zinc-800 border border-zinc-700 group-hover:border-blue-500/50 transition-colors`}>
                      <Zap size={18} className={entry.hadPRBonus ? 'text-yellow-500' : 'text-blue-500'} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">
                        {entry.workoutTitle ||
                          (entry.workoutId
                            ? String(entry.workoutId).replace(/-/g, ' ').toUpperCase()
                            : 'Workout')}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {entry.timestamp &&
                          `${new Date(entry.timestamp).toLocaleDateString()} • ${new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="block font-mono text-yellow-500 font-bold text-sm">
                        +{entry.xpEarned ?? (entry.duration ? entry.duration * 10 : 0)} XP
                      </span>
                      <span className="text-[10px] text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        {entry.duration ? Math.round(entry.duration) : 15} min
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          {showEvolution && (
            <EvolutionView photoLogs={photoLogs} isPrivacyMode={isPrivacyMode} />
          )}
          <ProgressReport
            history={history}
            foodLogs={foodLogs}
            weightLogs={weightLogs}
            proteinGoal={proteinGoal}
          />
          <GoalSetter
            currentGoal={proteinGoal}
            onUpdate={updateGoal}
            userWeight={userWeight}
            weightUnit={weightUnit}
            workoutHistory={history}
          />
          <WeightLogger
            currentWeight={userWeight}
            unit={weightUnit}
            onLog={logWeight}
          />
          <PhotoVault
            photoLogs={photoLogs}
            onUpload={savePhoto}
            onDelete={deletePhoto}
            isPrivacyMode={isPrivacyMode}
            togglePrivacy={togglePrivacy}
          />
          <button
            type="button"
            onClick={() => setShowLogger(true)}
            className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl flex items-center justify-center gap-2 text-zinc-500 hover:text-blue-400 hover:border-blue-500/50 transition-all mb-4"
          >
            <Plus size={18} /> LOG MEAL
          </button>

          <div className="space-y-3">
            {sortedFoodLogs.length === 0 ? (
              <div className="text-center py-10 text-zinc-600 italic">
                No food logged yet. <br /> Start tracking your nutrition.
              </div>
            ) : (
              sortedFoodLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        log.type === 'recipe'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : log.type === 'custom'
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-green-500/10 text-green-500'
                      }`}
                    >
                      {log.type === 'recipe' ? (
                        <Utensils size={18} />
                      ) : (
                        <Apple size={18} />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{log.item}</p>
                      <p className="text-[10px] text-zinc-500 uppercase">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {log.calories != null && (
                      <span className="text-xs font-mono text-zinc-500 block">{log.calories} kcal</span>
                    )}
                    {log.protein != null && (
                      <span className="text-[10px] text-orange-400 font-mono">{log.protein}g</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Food Logger Modal */}
      {showLogger && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg">
            <FoodLogger
              onLog={(food) => {
                logFood(food);
                setShowLogger(false);
              }}
              onClose={() => setShowLogger(false)}
            />
          </div>
        </div>
      )}

      {/* Mission Debrief Modal */}
      {selectedWorkout && (
        <MissionDebrief 
          workout={selectedWorkout} 
          onClose={() => setSelectedWorkout(null)} 
        />
      )}
    </div>
  );
}
