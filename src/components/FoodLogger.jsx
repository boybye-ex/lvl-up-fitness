import { useState } from 'react';
import { Plus, Utensils, X, Sparkles, Keyboard } from 'lucide-react';
import { recipes } from '../data/recipes';
import AIPhotoLogger from './AIPhotoLogger';

const powerFoods = [
  'Almonds',
  'Beans',
  'Spinach',
  'Dairy',
  'Oatmeal',
  'Eggs',
  'Turkey',
  'Peanut Butter',
  'Olive Oil',
  'Whole Grains',
  'Whey',
  'Berries',
];

export default function FoodLogger({ onLog, onClose }) {
  const [activeTab, setActiveTab] = useState('ai'); // Default to AI scan
  const [customName, setCustomName] = useState('');
  const [customCal, setCustomCal] = useState('');
  const [customPro, setCustomPro] = useState('');

  const handleLogCustom = () => {
    const name = (customName || '').trim();
    if (!name) return;
    const calories = customCal === '' ? null : Number(customCal);
    const protein = customPro === '' ? null : Number(customPro);
    onLog({
      title: name,
      calories: Number.isNaN(calories) ? null : calories,
      protein: Number.isNaN(protein) ? null : protein,
      type: 'custom',
    });
    setCustomName('');
    setCustomCal('');
    setCustomPro('');
    onClose();
  };

  const handleAIResult = (result) => {
    onLog(result);
    onClose();
  };

  return (
    <div className="bg-zinc-950 rounded-t-3xl p-6 border-t border-zinc-800 max-h-[90vh] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">
          Fuel Logger
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-500 hover:text-white p-2"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-zinc-900 p-1 rounded-2xl mb-6">
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === 'ai' ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Sparkles size={14} /> AI Scan
        </button>
        <button 
          onClick={() => setActiveTab('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            activeTab === 'manual' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Keyboard size={14} /> Manual Log
        </button>
      </div>

      {activeTab === 'ai' ? (
        <AIPhotoLogger onResult={handleAIResult} onCancel={onClose} />
      ) : (
        <>
          {/* Quick Powerfoods */}
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
            The 12 Powerfoods
          </h4>
          <div className="flex flex-wrap gap-2 mb-8">
            {powerFoods.map((food) => (
              <button
                key={food}
                type="button"
                onClick={() => {
                  onLog({ name: food, type: 'powerfood' });
                  onClose();
                }}
                className="bg-zinc-800 hover:bg-blue-600 text-white text-xs px-3 py-2 rounded-full border border-zinc-700 transition-colors"
              >
                + {food}
              </button>
            ))}
          </div>

          {/* Quick Recipes */}
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
            15-Minute Recipes
          </h4>
          <div className="space-y-2">
            {recipes.map((recipe) => (
              <button
                key={recipe.id}
                type="button"
                onClick={() => {
                  onLog(recipe);
                  onClose();
                }}
                className="w-full flex items-center justify-between bg-zinc-800/50 p-3 rounded-xl border border-zinc-800 hover:border-blue-500 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Utensils size={16} className="text-yellow-500" />
                  <span className="text-sm font-bold text-zinc-200">{recipe.title}</span>
                </div>
                <Plus size={16} className="text-zinc-500" />
              </button>
            ))}
          </div>

          {/* Custom Entry */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Custom Entry</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="What did you eat?"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500 placeholder:text-zinc-500"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="Calories"
                  value={customCal}
                  onChange={(e) => setCustomCal(e.target.value)}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500 placeholder:text-zinc-500"
                />
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="Protein (g)"
                  value={customPro}
                  onChange={(e) => setCustomPro(e.target.value)}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500 placeholder:text-zinc-500"
                />
              </div>
              <button
                type="button"
                onClick={handleLogCustom}
                disabled={!(customName || '').trim()}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                LOG CUSTOM MEAL
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
