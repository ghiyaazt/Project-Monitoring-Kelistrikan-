import React from 'react';

interface KamarHeaderProps {
  kamarNama: string;
  kamarId: string;
  onBack?: () => void;
  isDark: boolean;
}

export default function KamarHeader({ kamarNama, kamarId, onBack, isDark }: KamarHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {onBack && (
        <button
          onClick={onBack}
          className={`p-2 rounded-lg transition-colors ${
            isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <div className="flex-1">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {kamarNama}
        </h1>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          ID: {kamarId}
        </p>
      </div>
    </div>
  );
}
