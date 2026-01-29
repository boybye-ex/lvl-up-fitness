import { ArrowLeft, Trash2 } from 'lucide-react';

export default function SettingsView({ onBack, onResetProgress }) {
  const handleReset = () => {
    if (window.confirm('Reset all progress? This will clear your XP, level, and workout history.')) {
      onResetProgress?.();
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft />
        </button>
        <h2 className="text-2xl font-black italic tracking-tighter text-white">
          SETTINGS
        </h2>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Data</h3>
          <button
            onClick={handleReset}
            className="w-full py-3 rounded-lg bg-zinc-800 border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 flex items-center justify-center gap-2 text-sm font-bold transition-all"
          >
            <Trash2 size={18} />
            Reset Progress
          </button>
          <p className="text-zinc-500 text-xs mt-2">Clears XP, level, and workout history. Cannot be undone.</p>
        </div>
      </div>
    </div>
  );
}
