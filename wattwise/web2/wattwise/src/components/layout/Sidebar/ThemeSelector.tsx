interface ThemeSelectorProps {
  collapsed: boolean;
  isDark: boolean;
  themeMode: 'light' | 'dark' | 'system';
  effectiveTheme: 'light' | 'dark';
  onSetThemeMode?: (mode: 'light' | 'dark' | 'system') => void;
}

export default function ThemeSelector({
  collapsed,
  isDark,
  themeMode,
  effectiveTheme,
  onSetThemeMode
}: ThemeSelectorProps) {
  if (collapsed) return null;

  const textTertiary = isDark ? 'text-slate-500' : 'text-gray-500';

  return (
    <div className="px-2">
      <div className="flex items-center gap-2 mb-2">
        <svg className={`w-4 h-4 ${textTertiary}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        <p className={`text-xs font-semibold ${textTertiary}`}>Tema Tampilan</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSetThemeMode?.('light')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-lg text-[10px] font-medium transition ${
            themeMode === 'light'
              ? isDark ? 'bg-slate-700 text-slate-100 shadow-sm' : 'bg-blue-100 text-blue-700 shadow-sm'
              : isDark ? 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>Terang</span>
        </button>
        <button
          onClick={() => onSetThemeMode?.('dark')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-lg text-[10px] font-medium transition ${
            themeMode === 'dark'
              ? isDark ? 'bg-slate-700 text-slate-100 shadow-sm' : 'bg-blue-100 text-blue-700 shadow-sm'
              : isDark ? 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <span>Gelap</span>
        </button>
        <button
          onClick={() => onSetThemeMode?.('system')}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-lg text-[10px] font-medium transition ${
            themeMode === 'system'
              ? isDark ? 'bg-slate-700 text-slate-100 shadow-sm' : 'bg-blue-100 text-blue-700 shadow-sm'
              : isDark ? 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Sistem</span>
        </button>
      </div>
      {themeMode === 'system' && (
        <p className={`text-[10px] mt-1.5 text-center ${textTertiary}`}>
          Aktif: <span className="font-semibold">{effectiveTheme === 'dark' ? 'Gelap' : 'Terang'}</span>
        </p>
      )}
    </div>
  );
}
