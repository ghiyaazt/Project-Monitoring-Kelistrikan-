import { useState, useEffect } from 'react';
import { ThemeMode } from '../../context/types';
import { STORAGE_KEYS, loadFromStorage, saveToStorage, getSystemTheme } from '../../context/storage';

export const useThemeManagement = () => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() =>
    loadFromStorage(STORAGE_KEYS.THEME, 'system' as ThemeMode)
  );

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => {
    const savedMode = loadFromStorage(STORAGE_KEYS.THEME, 'system' as ThemeMode);
    return savedMode === 'system' ? getSystemTheme() : savedMode;
  });

  // Listen to system theme changes
  useEffect(() => {
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setEffectiveTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [effectiveTheme]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    saveToStorage(STORAGE_KEYS.THEME, mode);
    
    if (mode === 'system') {
      setEffectiveTheme(getSystemTheme());
    } else {
      setEffectiveTheme(mode);
    }
  };

  return {
    themeMode,
    setThemeMode,
    effectiveTheme
  };
};
