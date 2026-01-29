import { ArrowRight } from 'lucide-react';
import { PrivatePhoto } from './PhotoVault';

export default function EvolutionView({ photoLogs, isPrivacyMode }) {
  const frontPhotos = (photoLogs || [])
    .filter((p) => p.side === 'front')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (frontPhotos.length < 2) return null;

  const before = frontPhotos[0];
  const after = frontPhotos[frontPhotos.length - 1];
  const daysDiff = Math.floor((new Date(after.date) - new Date(before.date)) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-blue-600 p-6 rounded-3xl mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-black italic uppercase tracking-tighter">Your Evolution</h3>
        <span className="text-[10px] bg-white/20 text-white px-2 py-1 rounded-full font-bold">{daysDiff} Days</span>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 space-y-2">
          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-black/20">
            <PrivatePhoto url={before.url} isPrivacyMode={isPrivacyMode} />
          </div>
          <p className="text-center text-[9px] font-bold text-blue-200 uppercase">Day 1</p>
        </div>

        <div className="flex items-center text-white/50">
          <ArrowRight size={16} />
        </div>

        <div className="flex-1 space-y-2">
          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-black/20 shadow-xl border-2 border-white/30">
            <PrivatePhoto url={after.url} isPrivacyMode={isPrivacyMode} />
          </div>
          <p className="text-center text-[9px] font-bold text-white uppercase">Today</p>
        </div>
      </div>
    </div>
  );
}
