import React, { useState } from 'react';

export default function RecipeCard({ recipe, onReset }) {
  const [copied, setCopied] = useState(false);

  if (!recipe) return null;

  const handleCopy = () => {
    const text = `🍳 ${recipe.name}\n${recipe.description}\n\n⏱ Time: ${recipe.time} | 🔥 Difficulty: ${recipe.difficulty}\n\nIngredients:\n${recipe.ingredients.map(i => `- ${i}`).join('\n')}\n\nSteps:\n${recipe.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}\n\n💡 Hostel Tip: ${recipe.hostel_tip}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-orange-500/5 border border-orange-100 transition-all duration-300 animate-fadeIn">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="text-xs font-semibold tracking-wider uppercase px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
          AI Hostel Recipe
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            type="button"
            className="text-xs font-medium text-gray-500 hover:text-gray-800 px-2.5 py-1 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            {copied ? '✓ Copied' : '📋 Copy text'}
          </button>
          <button
            onClick={onReset}
            type="button"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded-lg transition-colors cursor-pointer"
          >
            ← Cook Another
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-gray-100 pb-5 mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-start gap-2">
          <span className="text-3xl select-none">🍳</span>
          <span>{recipe.name}</span>
        </h2>
        <p className="mt-2 text-gray-600 text-base leading-relaxed">
          {recipe.description}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-800 text-sm font-semibold border border-orange-100">
            <span>⏱</span>
            <span>{recipe.time || '15 mins'}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-sm font-semibold border border-amber-100">
            <span>🔥</span>
            <span>{recipe.difficulty || 'Easy'}</span>
          </div>
        </div>
      </div>

      {/* Grid: Ingredients & Steps */}
      <div className="space-y-6">
        {/* Ingredients */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>🛒</span> Ingredients You Need
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recipe.ingredients.map((ing, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2.5 bg-orange-50/50 p-2.5 rounded-xl text-sm font-medium text-gray-800 border border-orange-100/60"
              >
                <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                <span>{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>👨‍🍳</span> Step-by-Step Instructions
          </h3>
          <ol className="space-y-3">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-gray-700 leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center mt-0.5 shadow-sm">
                  {idx + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Hostel Tip Callout */}
        {recipe.hostel_tip && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 flex items-start gap-3 shadow-inner">
            <span className="text-2xl flex-shrink-0 select-none">💡</span>
            <div>
              <h4 className="font-bold text-sm text-amber-900 uppercase tracking-wider mb-1">
                Hostel Hack &amp; Tip
              </h4>
              <p className="text-sm sm:text-base text-amber-800 leading-relaxed font-medium">
                {recipe.hostel_tip}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Make Another Button */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onReset}
          type="button"
          className="w-full py-3.5 px-6 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-base transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <span>Make Another Recipe</span>
          <span>🍳</span>
        </button>
      </div>
    </div>
  );
}
