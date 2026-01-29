import { useState, useRef, useCallback } from 'react';
import { Download, Share2, X, Check } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function PRShareCard({ prData, userLevel, onClose }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const captureRef = useRef(null);

  const captureCard = useCallback(async () => {
    if (!captureRef.current) return null;
    
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      return canvas;
    } catch (error) {
      console.error('Failed to capture card:', error);
      return null;
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const canvas = await captureCard();
      if (!canvas) throw new Error('Failed to capture');

      const link = document.createElement('a');
      link.download = `PR-${prData.exercise.replace(/\s+/g, '-')}-${prData.value}lbs.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save image. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const canvas = await captureCard();
      if (!canvas) throw new Error('Failed to capture');

      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('Failed to create shareable image');
          setIsSharing(false);
          return;
        }

        const file = new File([blob], `PR-${prData.exercise}.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: `New PR: ${prData.exercise}`,
              text: `Just hit a new PR! ${prData.value} lbs on ${prData.exercise} 💪 #STRIVE15`,
            });
          } catch (shareError) {
            if (shareError.name !== 'AbortError') {
              console.error('Share failed:', shareError);
            }
          }
        } else {
          // Fallback: copy to clipboard or download
          handleSave();
        }
        setIsSharing(false);
      }, 'image/png');
    } catch (error) {
      console.error('Share failed:', error);
      setIsSharing(false);
    }
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white p-2"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      )}

      {/* The Actual Card to be Captured */}
      <div 
        ref={captureRef}
        id="pr-capture-area" 
        className="w-[300px] aspect-square bg-black p-8 border-[12px] border-zinc-900 relative overflow-hidden shadow-2xl"
      >
        {/* Background Branding Elements */}
        <div className="absolute top-[-20px] right-[-20px] text-[100px] font-black italic opacity-5 text-white pointer-events-none select-none">
          15M
        </div>
        
        {/* Diagonal Stripes Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
            backgroundSize: '10px 10px',
          }}
        />
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Header */}
          <div>
            <p className="text-blue-500 font-black italic text-xs tracking-widest uppercase">
              Mission Success
            </p>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none mt-1">
              {prData.exercise}
            </h2>
            <p className="text-zinc-600 text-[8px] font-bold uppercase mt-1">
              {formatDate()}
            </p>
          </div>

          {/* Main PR Value */}
          <div className="text-center py-4">
            <div className="relative inline-block">
              <span className="text-6xl font-black text-white italic tracking-tighter">
                {prData.value}
              </span>
              <span className="text-blue-500 font-black text-xl italic ml-1">
                {prData.unit || 'LBS'}
              </span>
            </div>
            {prData.previousBest && (
              <p className="text-xs text-green-500 font-bold mt-2">
                +{prData.value - prData.previousBest} {prData.unit || 'LBS'} IMPROVEMENT
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end border-t border-zinc-800 pt-4">
            <div>
              <p className="text-[8px] text-zinc-500 font-bold uppercase">Athlete Level</p>
              <p className="text-white font-black italic text-sm">LVL {userLevel}</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] text-zinc-500 font-bold uppercase italic tracking-tighter">Powered by</p>
              <p className="text-blue-500 font-black italic text-sm">STRIVE 15</p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Actions */}
      <div className="flex gap-4">
        <button 
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-xs font-bold border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {saveSuccess ? (
            <>
              <Check size={14} className="text-green-500" /> SAVED!
            </>
          ) : (
            <>
              <Download size={14} /> {isSaving ? 'SAVING...' : 'SAVE'}
            </>
          )}
        </button>
        <button 
          type="button"
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <Share2 size={14} /> {isSharing ? 'SHARING...' : 'SHARE'}
        </button>
      </div>

      <p className="text-zinc-600 text-[10px] text-center max-w-[280px]">
        Share your achievement and inspire others on their fitness journey!
      </p>
    </div>
  );
}
