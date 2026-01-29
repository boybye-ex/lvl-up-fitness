import { useRef, useState } from 'react';
import { Camera, Trash2, Lock, Unlock, EyeOff } from 'lucide-react';
import { useHaptics } from '../hooks/useHaptics';

export function PrivatePhoto({ url, isPrivacyMode }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const timerRef = useRef(null);
  const haptics = useHaptics();

  const startPress = () => {
    if (!isPrivacyMode) return;
    timerRef.current = setTimeout(() => {
      setIsRevealed(true);
      haptics.medium();
    }, 500);
  };

  const endPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setIsRevealed(false);
  };

  if (!isPrivacyMode) {
    return <img src={url} alt="" className="w-full h-full object-cover rounded-2xl" />;
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-2xl cursor-pointer touch-none select-none"
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startPress();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') endPress();
      }}
    >
      <img
        src={url}
        alt=""
        className={`w-full h-full object-cover transition-all duration-300 ${
          isPrivacyMode && !isRevealed ? 'blur-2xl scale-110' : 'blur-0 scale-100'
        }`}
      />
      {isPrivacyMode && !isRevealed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 pointer-events-none">
          <EyeOff size={20} className="text-white/40 mb-1" />
          <span className="text-[7px] text-white/40 font-bold uppercase">Hold to View</span>
        </div>
      )}
    </div>
  );
}

export default function PhotoVault({ photoLogs, onUpload, onDelete, isPrivacyMode, togglePrivacy }) {
  const fileInputRef = useRef(null);
  const [activeSide, setActiveSide] = useState('front');

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpload(reader.result, activeSide);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const getLatestBySide = (side) => (photoLogs || []).filter((p) => p.side === side).sort((a, b) => b.id - a.id)[0];

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-black italic uppercase text-lg tracking-tighter">Visual Progress</h3>
        <button
          type="button"
          onClick={togglePrivacy}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[10px] font-bold uppercase ${
            isPrivacyMode ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'
          }`}
        >
          {isPrivacyMode ? <Lock size={14} /> : <Unlock size={14} />}
          {isPrivacyMode ? 'Private' : 'Public'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {['front', 'side', 'back'].map((side) => {
          const photo = getLatestBySide(side);
          return (
            <div
              key={side}
              className="relative aspect-[3/4] bg-black rounded-2xl overflow-hidden border border-zinc-800 group"
            >
              {photo ? (
                <>
                  <div className="absolute inset-0">
                    <PrivatePhoto url={photo.url} isPrivacyMode={isPrivacyMode} />
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete(photo.id)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-label="Delete photo"
                  >
                    <Trash2 size={12} />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setActiveSide(side);
                    fileInputRef.current?.click();
                  }}
                  className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-600 hover:text-blue-500 transition-colors"
                >
                  <Camera size={24} />
                  <span className="text-[8px] font-bold uppercase">{side}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFile}
      />
    </div>
  );
}
