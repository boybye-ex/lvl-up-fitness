import { useState } from 'react';
import { Sparkles, Send, X, MessageSquare, Loader2 } from 'lucide-react';
import { getAICoachAdvice } from '../utils/geminiCoach';

export default function CoachChat({ userData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const askCoach = async () => {
    if (!query.trim()) return;
    
    const userMessage = { role: 'user', content: query };
    setChatHistory(prev => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const advice = await getAICoachAdvice(userData, query);
      const coachResponse = { role: 'coach', content: advice };
      setChatHistory(prev => [...prev, coachResponse]);
    } catch (error) {
      const errorMessage = { role: 'error', content: error.message };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      {/* Mini Bubble Version when closed */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex items-center justify-between hover:bg-zinc-800 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Sparkles size={20} />
            </div>
            <div className="text-left">
              <p className="text-blue-500 font-black italic uppercase text-[10px] tracking-widest">AI Coach Available</p>
              <p className="text-zinc-400 text-xs">Ask about your form, meals, or routine...</p>
            </div>
          </div>
          <MessageSquare size={18} className="text-zinc-600" />
        </button>
      )}

      {/* Expanded Chat View */}
      {isOpen && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-500" />
              <h3 className="text-blue-500 font-black italic uppercase text-xs">STRIVE-15 AI Coach</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-600 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {chatHistory.length === 0 && (
              <div className="text-center py-8">
                <p className="text-zinc-500 text-xs italic">"How can I help you dominate your 15-minute mission today?"</p>
              </div>
            )}
            
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : msg.role === 'error'
                    ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                    : 'bg-zinc-800 text-zinc-200 rounded-tl-none'
                }`}>
                  {msg.content}
                  {/* Retry button for error messages */}
                  {msg.role === 'error' && msg.content.includes("resting") && (
                    <button 
                      onClick={() => {
                        // Remove the error message and retry with the last user query
                        const lastUserMsg = chatHistory.filter(m => m.role === 'user').pop();
                        if (lastUserMsg) {
                          setChatHistory(prev => prev.filter((_, idx) => idx !== i));
                          setQuery(lastUserMsg.content);
                        }
                      }}
                      className="mt-2 block text-[10px] font-bold text-blue-400 uppercase tracking-widest border-b border-blue-400/30 hover:text-blue-300 transition-colors"
                    >
                      Tap to wake up the coach
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-blue-500" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analysing...</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askCoach()}
              placeholder="Message your coach..."
              className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none placeholder:text-zinc-700"
            />
            <button 
              onClick={askCoach}
              disabled={loading || !query.trim()}
              className="bg-blue-600 text-white p-3 rounded-xl font-bold disabled:opacity-50 disabled:bg-zinc-800 transition-all active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
