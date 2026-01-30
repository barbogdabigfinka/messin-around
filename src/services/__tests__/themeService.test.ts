import ThemeService from '../themeService';
import { THEME } from '../../constants/config';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  test('setTheme and getTheme persist preference', () => {
    expect(ThemeService.getTheme()).toBeDefined();
    ThemeService.setTheme(THEME.DARK);
    expect(ThemeService.getTheme()).toBe(THEME.DARK);
  });

  test('applyTheme sets document attribute', () => {
    ThemeService.applyTheme(THEME.DARK);
    expect(document.documentElement.getAttribute('data-theme')).toBe(THEME.DARK);
  });

  test('toggleTheme flips theme', () => {
    ThemeService.setTheme(THEME.LIGHT);
    const newTheme = ThemeService.toggleTheme();
    expect(newTheme).toBe(THEME.DARK);
    expect(ThemeService.getTheme()).toBe(THEME.DARK);
  });
});
