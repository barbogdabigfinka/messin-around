import StorageService from '../storageService';
import { STORAGE_KEYS } from '../../constants/config';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('setItem and getItem should store and retrieve JSON', () => {
    const key = 'test:key';
    const value = { a: 1, b: 'x' };
    const ok = StorageService.setItem(key, value);
    expect(ok).toBe(true);
    const loaded = StorageService.getItem(key, null);
    expect(loaded).toEqual(value);
  });

  test('removeItem should remove key', () => {
    const key = 'test:remove';
    StorageService.setItem(key, 123);
    expect(localStorage.getItem(key)).not.toBeNull();
    const ok = StorageService.removeItem(key);
    expect(ok).toBe(true);
    expect(localStorage.getItem(key)).toBeNull();
  });

  test('clear should remove configured storage keys', () => {
    StorageService.setItem(STORAGE_KEYS.TASKS, [{ id: 1 }]);
    StorageService.setItem(STORAGE_KEYS.THEME, 'dark');
    expect(localStorage.getItem(STORAGE_KEYS.TASKS)).not.toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.THEME)).not.toBeNull();
    const ok = StorageService.clear();
    expect(ok).toBe(true);
    expect(localStorage.getItem(STORAGE_KEYS.TASKS)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBeNull();
  });
});
