/**
 * Theme management service
 */

import { Theme } from '../types/index';
import { STORAGE_KEYS, THEME } from '../constants/config';
import StorageService from './storageService';

/**
 * ThemeService - Handles theme persistence and application
 */
class ThemeService {
  /**
   * Get current theme preference
   * @returns Current theme or system default
   */
  static getTheme(): Theme {
    const theme = StorageService.getItem<Theme | null>(STORAGE_KEYS.THEME, null);
    if (theme && (theme === THEME.LIGHT || theme === THEME.DARK)) {
      return theme;
    }

    // Default to light theme, or system preference if available
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEME.DARK;
    }

    return THEME.LIGHT;
  }

  /**
   * Set theme preference
   * @param theme Theme to set
   * @returns Success status
   */
  static setTheme(theme: Theme): boolean {
    return StorageService.setItem(STORAGE_KEYS.THEME, theme);
  }

  /**
   * Apply theme to DOM
   * @param theme Theme to apply
   */
  static applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  /**
   * Toggle between light and dark themes
   * @returns New theme after toggle
   */
  static toggleTheme(): Theme {
    const current = this.getTheme();
    const newTheme = current === THEME.DARK ? THEME.LIGHT : THEME.DARK;
    this.setTheme(newTheme);
    return newTheme;
  }

  /**
   * Initialize theme on app load
   */
  static initialize(): void {
    const theme = this.getTheme();
    this.applyTheme(theme);
  }
}

export default ThemeService;
