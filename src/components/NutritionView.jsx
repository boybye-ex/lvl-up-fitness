import { useState } from 'react';
import { ArrowLeft, Clock, Flame, ChevronRight, ShoppingCart, Trash2, CheckSquare, Check, Info } from 'lucide-react';
import { recipes } from '../data/recipes';
import { kitchenOverhaul, shoppingList } from '../data/kitchen';
import { foodScience } from '../data/foodScience';
import { useHaptics } from '../hooks/useHaptics';

const powerFoods = [
  { name: 'A: Almonds & Nuts', benefit: 'Building muscle, fighting cravings' },
  { name: 'B: Beans & Legumes', benefit: 'Burn fat, regulate digestion' },
  { name: 'S: Spinach & Green Veg', benefit: 'Fight free radicals' },
  { name: 'D: Dairy (Low-Fat)', benefit: 'Strong bones, weight loss kickstarter' },
  { name: 'I: Instant Oatmeal', benefit: 'Boosts energy, lowers cholesterol' },
  { name: 'E: Eggs', benefit: 'Build muscle, burn fat' },
  { name: 'T: Turkey & Lean Meat', benefit: 'Strengthens immune system' },
  { name: 'P: Peanut Butter', benefit: 'Boosts testosterone, burns fat' },
  { name: 'O: Olive Oil', benefit: 'Lowers cholesterol, boosts immune system' },
  { name: 'W: Whole Grains', benefit: 'Prevents body from storing fat' },
  { name: 'E: Extra-Protein (Whey)', benefit: 'Builds muscle, burns fat' },
  { name: 'R: Raspberries & Berries', benefit: 'Improves satiety, prevents cravings' },
];

export default function NutritionView({ onBack }) {
  const [activeTab, setActiveTab] = useState('recipes');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [checkedTools, setCheckedTools] = useState({});
  const [selectedFood, setSelectedFood] = useState(null);
  const haptics = useHaptics();

  const toggleTool = (index) => {
    setCheckedTools((prev) => ({ ...prev, [index]: !prev[index] }));
    haptics.light();
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-black italic tracking-tighter text-white">
          FUEL <span className="text-yellow-500">STATION</span>
        </h2>
      </div>

      <div className="flex gap-4 mb-6 border-b border-zinc-800 pb-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab('recipes');
            setSelectedRecipe(null);
          }}
          className={`text-sm font-bold uppercase pb-2 border-b-2 -mb-0.5 transition-colors ${
            activeTab === 'recipes' ? 'text-yellow-500 border-yellow-500' : 'text-zinc-500 border-transparent hover:text-zinc-400'
          }`}
        >
          15-Min Meals
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('pantry');
            setSelectedRecipe(null);
          }}
          className={`text-sm font-bold uppercase pb-2 border-b-2 -mb-0.5 transition-colors ${
            activeTab === 'pantry' ? 'text-green-500 border-green-500' : 'text-zinc-500 border-transparent hover:text-zinc-400'
          }`}
        >
          Pantry
        </button>
      </div>

      {activeTab === 'recipes' && !selectedRecipe && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">Meals you can make in 15 minutes or less.</p>
          {recipes.map((recipe) => (
            <button
              type="button"
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="w-full text-left bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center group hover:border-yellow-500/50 active:scale-[0.98] transition-all"
            >
              <div>
                <h4 className="font-bold text-white">{recipe.title}</h4>
                <div className="flex gap-3 mt-1 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {recipe.time}
                  </span>
                  <span className="flex items-center gap-1 text-yellow-600">
                    <Flame size={12} /> {recipe.calories} kcal
                  </span>
                </div>
              </div>
              <ChevronRight size={20} className="text-zinc-600 group-hover:text-white shrink-0" />
            </button>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <div className="space-y-4">
          <div className="bg-zinc-800/80 border border-zinc-700 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-black text-white mb-2">{selectedRecipe.title}</h2>
            <div className="flex gap-4 text-xs font-mono text-zinc-400 mb-6 border-b border-zinc-700 pb-4">
              <span>{selectedRecipe.time}</span>
              <span>{selectedRecipe.calories} CAL</span>
              <span className="text-blue-400">{selectedRecipe.protein} PROTEIN</span>
            </div>
            <h4 className="text-xs font-bold uppercase text-yellow-500 mb-2">Ingredients</h4>
            <ul className="list-disc list-inside text-sm text-zinc-300 mb-6 space-y-1">
              {selectedRecipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
            <h4 className="text-xs font-bold uppercase text-blue-500 mb-2">Instructions</h4>
            <p className="text-sm text-zinc-300 leading-relaxed">{selectedRecipe.instructions}</p>
            <button
              type="button"
              onClick={() => setSelectedRecipe(null)}
              className="w-full mt-8 bg-zinc-900 text-zinc-400 py-3 rounded-lg font-bold text-xs hover:text-white hover:bg-zinc-800 transition-colors"
            >
              BACK TO MENU
            </button>
          </div>
        </div>
      )}

      {activeTab === 'pantry' && (
        <div className="space-y-8">
          <section>
            <h3 className="text-yellow-500 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              The 12 Power Pillars
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Eat mostly from these 12 groups to satisfy hunger and build muscle. (Remember: ABS DIET POWER)
            </p>
            <div className="grid grid-cols-1 gap-2">
              {powerFoods.map((item, i) => (
                <div
                  key={i}
                  className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center hover:border-blue-500/50 transition-colors"
                >
                  <span className="text-white font-bold text-sm">{item.name}</span>
                  <span className="text-zinc-500 text-xs text-right max-w-[150px]">{item.benefit}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-red-500 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Trash2 size={18} /> The Kitchen Purge
            </h3>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-4">
              <p className="text-xs text-zinc-400 italic">&ldquo;{kitchenOverhaul[0].tip}&rdquo;</p>
              <ul className="space-y-2">
                {kitchenOverhaul[0].items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-green-500 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShoppingCart size={18} /> Master Shopping List
            </h3>
            <div className="grid gap-4">
              {shoppingList.map((group, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                  <h4 className="font-bold text-white mb-2">{group.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item, j) => (
                      <button
                        key={j}
                        type="button"
                        onClick={() =>
                          setSelectedFood({
                            name: item,
                            info: foodScience[item] || 'A nutrient-dense staple for your 15-minute lifestyle.',
                          })
                        }
                        className="flex items-center gap-2 text-xs bg-black border border-zinc-700 text-zinc-300 px-3 py-2 rounded-xl hover:border-blue-500 transition-all active:scale-95"
                      >
                        <span>{item}</span>
                        <Info size={12} className="text-zinc-600" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-blue-400 font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckSquare size={18} /> Essential Tools
            </h3>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
              <p className="text-xs text-zinc-400 italic mb-3">&ldquo;{kitchenOverhaul[1].tip}&rdquo;</p>
              <div className="grid grid-cols-2 gap-2">
                {kitchenOverhaul[1].items.map((item, k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => toggleTool(k)}
                    className="flex items-center gap-2 text-xs text-zinc-300 text-left"
                  >
                    <div
                      className={`w-4 h-4 border rounded flex items-center justify-center shrink-0 ${
                        checkedTools[k] ? 'bg-blue-500 border-blue-500' : 'border-zinc-600'
                      }`}
                    >
                      {checkedTools[k] && <Check size={12} className="text-white" />}
                    </div>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {selectedFood && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedFood(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl max-w-xs w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
              <Info className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-black text-white italic uppercase mb-2">{selectedFood.name}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">{selectedFood.info}</p>
            <button
              type="button"
              onClick={() => setSelectedFood(null)}
              className="w-full bg-zinc-800 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
