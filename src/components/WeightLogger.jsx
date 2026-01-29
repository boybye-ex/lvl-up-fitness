import { useState, useEffect, useCallback } from 'react';
import { Scale } from 'lucide-react';
import useUnit from '../hooks/useUnit';
import { kgToLbs } from '../utils/converters';

export default function WeightLogger({ currentWeight, onLog }) {
  const { unit, convert, label } = useUnit();
  const [val, setVal] = useState(currentWeight ? convert(currentWeight) : '');
  
  useEffect(() => {
    if (currentWeight != null) setVal(convert(currentWeight));
  }, [currentWeight, convert]);

  const handleLog = useCallback(() => {
    const n = parseFloat(val);
    if (!Number.isNaN(n)) {
      // If currently in KG, convert back to LBS for storage
      const weightToLog = unit === 'kg' ? kgToLbs(n) : n;
      onLog(weightToLog);
    }
  }, [val, unit, onLog]);

  return (
    <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl mb-4">
      <div className="flex items-center gap-3 text-white">
        <Scale size={18} className="text-blue-400" />
        <div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Current Weight</p>
          <div className="flex items-baseline gap-1">
            <input
              type="number"
              inputMode="decimal"
              className="bg-transparent text-xl font-black w-16 outline-none"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onBlur={handleLog}
              placeholder="—"
            />
            <span className="text-xs text-zinc-600 font-bold">{label}</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={handleLog}
        className="text-[10px] font-bold bg-blue-600/10 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-colors"
      >
        LOG TODAY
      </button>
    </div>
  );
}
