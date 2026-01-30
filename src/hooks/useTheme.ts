/**
 * Custom hook for theme management
 */

import { useState, useEffect, useCallback } from 'react';
import { Theme } from '../types/index';
import ThemeService from '../services/themeService';

/**
 * Hook for managing application theme
 * @returns Theme state and toggle function
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => ThemeService.getTheme());

  // Apply theme on mount and when it changes
  useEffect(() => {
    ThemeService.applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    ThemeService.setTheme(newTheme);
  }, [theme]);

  return { theme, setTheme, toggleTheme };
}
