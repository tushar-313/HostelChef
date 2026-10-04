import React, { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
  "Rummaging through your hostel room...",
  "Consulting Gemma 4 12B for a quick recipe...",
  "Checking kettle boiling temperature...",
  "Optimizing for minimal utensil cleanup...",
  "Putting together a tasty hostel masterpiece...",
  "Almost ready to serve! 🍳"
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-orange-100 text-center flex flex-col items-center justify-center space-y-6">
      {/* Animated Cooking Icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-orange-100/70 flex items-center justify-center animate-pulse">
          <span className="text-4xl animate-bounce">🍳</span>
        </div>
        <div className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
        </div>
      </div>

      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-bold text-gray-800">
          Gemma is cooking up your recipe...
        </h3>
        <p className="text-sm text-brand-600 font-medium h-6 transition-all duration-300">
          {LOADING_MESSAGES[messageIndex]}
        </p>
      </div>

      <div className="w-48 bg-orange-100 rounded-full h-1.5 overflow-hidden">
        <div className="bg-brand-500 h-1.5 rounded-full w-2/3 animate-[shimmer_1.5s_infinite]"></div>
      </div>
    </div>
  );
}
