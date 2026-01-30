/**
 * Local storage service for persisting application data
 */

import { STORAGE_KEYS, ERRORS, THEME } from '../constants/config';

/**
 * Generic storage service for safe localStorage operations
 */
class StorageService {
  /**
   * Safely get an item from localStorage
   * @param key Storage key
   * @param defaultValue Default value if key doesn't exist
   * @returns Parsed value or default
   */
  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`${ERRORS.STORAGE_ERROR}: Failed to retrieve ${key}`, error);
      return defaultValue;
    }
  }

  /**
   * Safely set an item in localStorage
   * @param key Storage key
   * @param value Value to store
   * @returns Success status
   */
  static setItem<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`${ERRORS.STORAGE_ERROR}: Failed to save ${key}`, error);
      return false;
    }
  }

  /**
   * Remove an item from localStorage
   * @param key Storage key
   * @returns Success status
   */
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`${ERRORS.STORAGE_ERROR}: Failed to remove ${key}`, error);
      return false;
    }
  }

  /**
   * Clear all application storage
   * @returns Success status
   */
  static clear(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error(`${ERRORS.STORAGE_ERROR}: Failed to clear storage`, error);
      return false;
    }
  }
}

export default StorageService;
