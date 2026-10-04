import React from 'react';

const COMMON_SUGGESTIONS = [
  'Maggi noodles',
  '2 eggs',
  'Bread slices',
  'Cheese cube',
  '1 onion',
  'Butter / Oil',
  'Tomato',
  'Leftover rice',
  'Potato',
  'Milk'
];

export default function IngredientInput({ ingredients, setIngredients, error }) {
  const addSuggestion = (item) => {
    if (!ingredients.trim()) {
      setIngredients(item);
    } else if (!ingredients.toLowerCase().includes(item.toLowerCase())) {
      setIngredients(`${ingredients.trim()}, ${item}`);
    }
  };

  return (
    <div className="space-y-3">
      <label htmlFor="ingredients-input" className="block text-sm font-semibold text-gray-800">
        Ingredients you have right now <span className="text-brand-500">*</span>
      </label>
      <textarea
        id="ingredients-input"
        rows={4}
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="e.g. 1 packet Maggi, half onion, 1 egg, slice of cheese, leftover rice, butter..."
        className={`w-full p-4 rounded-2xl border ${
          error ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-brand-500 focus:ring-brand-500'
        } bg-white text-gray-800 placeholder-gray-400 text-base transition-all focus:outline-none focus:ring-2 focus:ring-opacity-40 shadow-inner resize-y`}
      />
      {error && (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      )}

      {/* Quick Add Suggestion Chips */}
      <div>
        <span className="text-xs font-medium text-gray-500 block mb-2">
          Tap to add common hostel staples:
        </span>
        <div className="flex flex-wrap gap-2">
          {COMMON_SUGGESTIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => addSuggestion(item)}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-orange-50 text-brand-700 hover:bg-orange-100 hover:text-brand-800 transition-colors border border-orange-200 active:scale-95 cursor-pointer"
            >
              + {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
