import { useState, useRef } from 'react';
import { Video, Sparkles, Loader2, X, Check, AlertTriangle, PlayCircle, Camera } from 'lucide-react';
import { analyzeExerciseForm } from '../utils/geminiVision';

export default function FormCheckView({ exerciseName, onAnalysis, onClose }) {
  const [videoFile, setVideoFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setIsAnalyzing(true);
      
      try {
        const analysis = await analyzeExerciseForm(file, exerciseName);
        setAnalysisResult(analysis);
      } catch (error) {
        console.error("Form Analysis Failed:", error);
        alert("Failed to analyze form. Please ensure the video is under 20MB and try again.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleReset = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setAnalysisResult(null);
  };

  return (
    <div className="bg-zinc-950 rounded-t-3xl p-6 border-t border-zinc-800 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 p-2 rounded-xl">
            <Video className="text-blue-500" size={20} />
          </div>
          <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">AI Form Check</h2>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white p-2">
          <X size={20} />
        </button>
      </div>

      {!videoFile && !analysisResult && (
        <div className="animate-in fade-in duration-500">
          <div className="bg-blue-600/10 border border-blue-500/20 p-5 rounded-3xl mb-8 flex gap-4">
            <div className="bg-blue-500/20 p-3 rounded-2xl h-fit">
              <Sparkles className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-1">Coach's Setup Guide</p>
              <p className="text-xs text-blue-200 leading-relaxed italic">
                "For best results, place your phone 5-7 feet away and film your full body from a side-on angle. Ensure the lighting is clear."
              </p>
            </div>
          </div>

          <button 
            onClick={() => fileInputRef.current.click()}
            className="w-full bg-white text-black font-black py-6 rounded-3xl flex flex-col items-center justify-center gap-3 shadow-xl active:scale-95 transition-all hover:bg-zinc-100"
          >
            <Camera size={32} />
            <div className="text-center">
              <p className="text-lg leading-none">UPLOAD TRAINING VIDEO</p>
              <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-widest">Max Size: 20MB</p>
            </div>
          </button>
          <input type="file" ref={fileInputRef} hidden accept="video/*" onChange={handleUpload} />
        </div>
      )}

      {isAnalyzing && (
        <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse rounded-full" />
            <Loader2 className="text-blue-500 animate-spin relative z-10" size={48} />
          </div>
          <h3 className="text-white font-black italic text-xl uppercase tracking-tighter mb-2">Analyzing Form...</h3>
          <p className="text-zinc-500 text-xs max-w-[200px] leading-relaxed">
            Gemini is processing your movement patterns and biomechanics.
          </p>
        </div>
      )}

      {analysisResult && (
        <div className="animate-in slide-in-from-bottom-8 duration-500">
          <div className="relative rounded-3xl overflow-hidden mb-6 border border-zinc-800 shadow-2xl">
            <video src={videoPreview} className="w-full aspect-video object-cover" controls />
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
              <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Safety Score</span>
              <span className={`text-lg font-black ${analysisResult.safetyScore > 7 ? 'text-green-500' : analysisResult.safetyScore > 4 ? 'text-yellow-500' : 'text-red-500'}`}>
                {analysisResult.safetyScore}/10
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-green-500/10 p-5 rounded-3xl border border-green-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Check className="text-green-500" size={16} />
                <p className="text-green-500 text-[10px] font-bold uppercase tracking-widest">Technique Pros</p>
              </div>
              <ul className="text-xs text-zinc-300 space-y-2">
                {analysisResult.pros.map((p, i) => (
                  <li key={i} className="flex gap-2 leading-relaxed">
                    <span className="text-green-500/50">•</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-500/10 p-5 rounded-3xl border border-red-500/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="text-red-500" size={16} />
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">Priority Corrections</p>
              </div>
              <ul className="text-xs text-zinc-300 space-y-2">
                {analysisResult.corrections.map((c, i) => (
                  <li key={i} className="flex gap-2 leading-relaxed">
                    <span className="text-red-500/50">⚠️</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl text-center mb-8 relative overflow-hidden">
             <div className="absolute -left-4 -top-4 text-blue-500/10 rotate-12"><PlayCircle size={80} /></div>
             <p className="text-white/90 text-sm italic leading-relaxed relative z-10 font-medium">
              "{analysisResult.coachInsight}"
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleReset}
              className="flex-1 bg-zinc-800 text-zinc-400 font-bold py-4 rounded-2xl hover:bg-zinc-700 transition-all"
            >
              TRY AGAIN
            </button>
            <button 
              onClick={onClose}
              className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-900/40 active:scale-95 transition-all"
            >
              DONE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
