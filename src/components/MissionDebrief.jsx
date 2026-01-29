import { X, Zap, Target, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import useUnit from '../hooks/useUnit';

export default function MissionDebrief({ workout, onClose }) {
  const { convert, label } = useUnit();

  if (!workout) return null;

  return (
    <div className="fixed inset-0 z-300 bg-black/95 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300">
      <div className="bg-zinc-900 w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] border-t sm:border border-zinc-800 p-8 shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Close Handle for Mobile */}
        <button onClick={onClose} className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-zinc-800 rounded-full mb-8 sm:hidden" />
        
        <div className="flex justify-between items-start mb-8 mt-4">
          <div>
            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none">
              Mission <span className="text-blue-500 italic">Debrief</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-2">
              Operation: {workout.workoutId?.replace(/-/g, ' ') || 'Custom Mission'} • {new Date(workout.timestamp).toLocaleDateString()}
            </p>
          </div>
          <button onClick={onClose} className="bg-zinc-800 p-2 rounded-full text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <StatBox 
            label="Total Volume" 
            value={`${convert(workout.totalVolume || 0)} ${label}`} 
            icon={<TrendingUp size={14}/>} 
          />
          <StatBox 
            label="Intensity" 
            value={workout.mood?.toUpperCase() || 'TACTICAL'} 
            icon={<Zap size={14}/>} 
          />
          <StatBox 
            label="Duration" 
            value={`${workout.duration}m`} 
            icon={<Clock size={14}/>} 
          />
          <StatBox 
            label="XP Earned" 
            value={`+${workout.xpEarned}`} 
            icon={<Target size={14}/>} 
          />
        </div>

        {/* PRs Section if any */}
        {workout.prs && workout.prs.length > 0 && (
          <div className="mb-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-yellow-500 mb-3">Records Shattered</h4>
            <div className="space-y-2">
              {workout.prs.map((pr, idx) => (
                <div key={idx} className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl flex items-center gap-3">
                  <Zap size={16} className="text-yellow-500" />
                  <div>
                    <p className="text-white font-bold text-xs uppercase">{pr.exercise}</p>
                    <p className="text-yellow-500 font-black italic text-sm">{convert(pr.value)} {label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercise List - Placeholder since history doesn't store full exercise details yet */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 mb-8">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Mission Log</h4>
          <div className="bg-black/40 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center">
            <div>
              <h4 className="text-white font-black italic uppercase text-xs mb-1">
                Total Output
              </h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase">
                {workout.totalReps || 0} Total Reps Logged
              </p>
            </div>
            <div className="text-right">
              <p className="text-white font-black italic text-sm">
                {workout.hadPRBonus ? '2X XP' : '1X XP'}
              </p>
              <p className="text-[8px] text-zinc-600 font-bold uppercase">Multiplier</p>
            </div>
          </div>
          
          <p className="text-[9px] text-zinc-600 text-center uppercase font-bold italic">
            Detailed exercise breakdown available for future missions
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={onClose}
          className="w-full py-5 bg-blue-600 rounded-4xl text-white font-black italic uppercase tracking-tighter shadow-lg shadow-blue-900/40 active:scale-95 transition-transform"
        >
          Acknowledge & Close
        </button>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-800 p-4 rounded-3xl">
      <div className="flex items-center gap-2 text-zinc-500 mb-1">
        {icon}
        <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-white font-black italic uppercase text-lg">{value}</p>
    </div>
  );
}
