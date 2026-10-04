import React from 'react';

export default function ErrorAlert({ message, onDismiss, onRetry }) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 text-red-900 shadow-sm transition-all duration-200">
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 select-none">⚠️</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-red-900 mb-0.5">
            Cooking Assistance Paused
          </h4>
          <p className="text-sm text-red-800 leading-relaxed font-medium">
            {message}
          </p>
          <div className="mt-3 flex items-center gap-3">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
              >
                Try Again
              </button>
            )}
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-xs font-medium text-red-700 hover:text-red-900 underline cursor-pointer"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
