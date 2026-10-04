import React from 'react';

export default function Header() {
  return (
    <header className="pt-8 pb-6 text-center px-4">
      <div className="inline-flex items-center justify-center gap-3 mb-3">
        <span className="text-4xl select-none animate-bounce">🍳</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
          Hostel<span className="text-brand-500">Chef</span>
        </h1>
      </div>
      <p className="text-lg sm:text-xl text-gray-600 font-medium max-w-xl mx-auto">
        Turn whatever's in your room into something you can eat. 🍳
      </p>
    </header>
  );
}
