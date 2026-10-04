import React from 'react';
import Header from './components/Header';

export default function App() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-between">
      <div className="container mx-auto px-4 max-w-3xl pb-16">
        <Header />
        <main className="mt-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">What's in your kitchen?</h2>
            <p className="text-gray-500 text-sm">HostelChef is ready to build your meal.</p>
          </div>
        </main>
      </div>
      <footer className="py-6 text-center text-sm text-gray-400">
        HostelChef &bull; Practical AI meal assistant for students
      </footer>
    </div>
  );
}
