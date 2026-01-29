import { useState, useRef } from 'react';
import { Camera, Sparkles, Loader2, X, Check, Utensils } from 'lucide-react';
import { analyzeMealImage } from '../utils/geminiVision';

export default function AIPhotoLogger({ onResult, onCancel }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);

    setIsProcessing(true);
    try {
      // Convert to Base64 for Gemini (without the data:image/jpeg;base64, prefix)
      const base64Reader = new FileReader();
      base64Reader.onloadend = async () => {
        const base64Data = base64Reader.result.split(',')[1];
        const analysis = await analyzeMealImage(base64Data);
        setAiResult(analysis);
        setIsProcessing(false);
      };
      base64Reader.readAsDataURL(file);
    } catch (error) {
      console.error("AI Analysis Failed:", error);
      alert("Failed to analyze image. Please try again.");
      setIsProcessing(false);
      setPreviewUrl(null);
    }
  };

  const handleConfirm = () => {
    if (aiResult) {
      onResult({
        title: aiResult.items.join(', '),
        protein: aiResult.protein,
        type: 'ai-scan',
        powerfoods: aiResult.powerfoods,
        tip: aiResult.tip
      });
    }
  };

  if (aiResult) {
    return (
      <div className="bg-zinc-900 rounded-3xl p-6 border border-blue-500/30 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-black italic text-xl uppercase tracking-tighter">Scan Result</h2>
          <button onClick={() => { setAiResult(null); setPreviewUrl(null); }} className="text-zinc-500 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex gap-4 mb-6">
          <img src={previewUrl} alt="Meal preview" className="w-24 h-24 rounded-2xl object-cover border border-zinc-800" />
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Estimated Protein</span>
            <span className="text-3xl font-black text-blue-500 italic">{aiResult.protein}g</span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase block mb-2 tracking-widest">Powerfoods Detected</span>
            <div className="flex flex-wrap gap-2">
              {aiResult.powerfoods.length > 0 ? aiResult.powerfoods.map(f => (
                <span key={f} className="bg-green-500/10 text-green-400 text-[10px] px-3 py-1.5 rounded-xl font-bold border border-green-500/20 flex items-center gap-1">
                  <Check size={12} /> {f}
                </span>
              )) : (
                <span className="text-zinc-600 text-[10px] italic">No specific powerfoods detected.</span>
              )}
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl">
            <p className="text-blue-100 text-xs italic leading-relaxed">
              "{aiResult.tip}"
            </p>
          </div>
        </div>

        <button 
          onClick={handleConfirm}
          className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-900/40"
        >
          <Utensils size={18} /> CONFIRM & LOG FUEL
        </button>
      </div>
    );
  }

  return (
    <div className="bg-blue-600 rounded-3xl p-6 mb-6 shadow-lg shadow-blue-900/40 relative overflow-hidden group">
      {/* Background decoration */}
      <Sparkles size={120} className="absolute -right-8 -bottom-8 text-blue-500/20 rotate-12 group-hover:scale-110 transition-transform duration-700" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-xl">
              <Sparkles size={18} className="text-white" />
            </div>
            <h3 className="text-white font-black italic uppercase tracking-tighter">AI Pantry Scan</h3>
          </div>
        </div>
        
        <p className="text-blue-100 text-xs mb-6 leading-relaxed font-medium">
          Snap a photo of your meal. I'll identify the <span className="text-white font-bold underline">12 Powerfoods</span> and estimate your protein intake automatically.
        </p>

        <button 
          onClick={() => fileInputRef.current.click()}
          disabled={isProcessing}
          className="w-full bg-white text-blue-600 font-black py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:shadow-2xl"
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              ANALYZING MEAL...
            </>
          ) : (
            <>
              <Camera size={20} />
              SCAN MEAL PHOTO
            </>
          )}
        </button>
        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleCapture} />
        
        {isProcessing && (
          <div className="mt-4 text-center">
             <p className="text-[10px] text-blue-200 font-bold uppercase tracking-[0.2em] animate-pulse">Running Nutrient Audit...</p>
          </div>
        )}
      </div>
    </div>
  );
}
