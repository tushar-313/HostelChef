import React from 'react';

const TIME_OPTIONS = [
  { value: '15 minutes', label: '15 min', sub: '⚡ Quick fix' },
  { value: '30 minutes', label: '30 min', sub: '🥪 Standard' },
  { value: '45 minutes', label: '45 min', sub: '🍲 Proper meal' },
  { value: '60 minutes', label: '60 min', sub: '👨‍🍳 Gourmet feast' },
];

const EQUIPMENT_OPTIONS = [
  { id: 'kettle', label: 'Electric Kettle', icon: '🫖' },
  { id: 'induction', label: 'Induction Cooktop', icon: '⚡' },
  { id: 'pan', label: 'Pan / Kadai', icon: '🍳' },
  { id: 'microwave', label: 'Microwave', icon: '📻' },
  { id: 'toaster', label: 'Sandwich Toaster', icon: '🥪' },
  { id: 'no-cook', label: 'No Appliance (Cold)', icon: '🥣' },
];

const DIET_OPTIONS = [
  'Any / No restriction',
  'Vegetarian 🥦',
  'Eggitarian 🥚',
  'Non-Veg 🍗',
  'Vegan 🌱',
];

export default function PreferencesInput({
  cookingTime,
  setCookingTime,
  selectedEquipment,
  setSelectedEquipment,
  dietaryPreference,
  setDietaryPreference,
  onSubmit,
  isLoading
}) {
  const toggleEquipment = (label) => {
    if (selectedEquipment.includes(label)) {
      if (selectedEquipment.length > 1) {
        setSelectedEquipment(selectedEquipment.filter((item) => item !== label));
      }
    } else {
      setSelectedEquipment([...selectedEquipment, label]);
    }
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Time Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2.5">
          ⏱ Maximum Cooking Time
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TIME_OPTIONS.map((t) => {
            const isSelected = cookingTime === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setCookingTime(t.value)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-brand-500 bg-orange-50/80 text-brand-900 shadow-sm ring-2 ring-brand-500/20'
                    : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/30 text-gray-700'
                }`}
              >
                <span className="font-bold text-base leading-tight">{t.label}</span>
                <span className="text-[11px] text-gray-500 mt-1 font-medium">{t.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          🍳 Cooking Equipment Available
        </label>
        <p className="text-xs text-gray-500 mb-2.5">Select all you have in your room</p>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((eq) => {
            const isSelected = selectedEquipment.includes(eq.label);
            return (
              <button
                key={eq.id}
                type="button"
                onClick={() => toggleEquipment(eq.label)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/20'
                    : 'bg-gray-100 hover:bg-gray-200/80 text-gray-700'
                }`}
              >
                <span>{eq.icon}</span>
                <span>{eq.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dietary Preference Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          🥗 Dietary Preference <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {DIET_OPTIONS.map((diet) => {
            const isSelected = dietaryPreference === diet;
            return (
              <button
                key={diet}
                type="button"
                onClick={() => setDietaryPreference(diet)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {diet}
              </button>
            );
          })}
        </div>
      </div>

      {/* Large CTA Button */}
      <div className="pt-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-lg shadow-lg shadow-orange-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>Cook Something</span>
          <span className="text-xl">🍳</span>
        </button>
      </div>
    </div>
  );
}
