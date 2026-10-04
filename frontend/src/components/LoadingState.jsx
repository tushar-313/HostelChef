import React from 'react';

export default function LoadingState() {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-orange-100 text-center flex flex-col items-center justify-center space-y-6">
      {/* Animated Cooking Icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-orange-100/70 flex items-center justify-center animate-pulse">
          <span className="text-4xl animate-bounce">👨‍🍳</span>
        </div>
        <div className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
        </div>
      </div>

      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-bold text-gray-800">
          Chef is thinking... 👨‍🍳
        </h3>
        <p className="text-sm text-brand-600 font-medium">
          Crafting a quick, hostel-friendly recipe for you...
        </p>
      </div>

      <div className="w-48 bg-orange-100 rounded-full h-1.5 overflow-hidden">
        <div className="bg-brand-500 h-1.5 rounded-full w-2/3 animate-pulse"></div>
      </div>
    </div>
  );
}
