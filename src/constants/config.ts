/**
 * Application configuration and constants
 */

// Storage keys
export const STORAGE_KEYS = {
  TASKS: 'tasks_v1',
  THEME: 'theme_preference',
} as const;

// Theme options
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// Task priorities with metadata
export const PRIORITY_CONFIG = {
  low: { label: '🟢 Low', color: '#10b981' },
  medium: { label: '🟡 Medium', color: '#f59e0b' },
  high: { label: '🔴 High', color: '#ef4444' },
} as const;

// Default categories
export const DEFAULT_CATEGORIES = [
  'General',
  'Work',
  'Personal',
  'Shopping',
  'Health',
  'Education',
] as const;

// Pagination and limits
export const PAGINATION = {
  TASKS_PER_PAGE: 50,
} as const;

// UI Messages
export const MESSAGES = {
  NO_TASKS: '📋 No tasks found. Add one to get started!',
  ADD_TASK_PLACEHOLDER: 'Add a new task...',
  SEARCH_PLACEHOLDER: '🔍 Search tasks...',
  TASK_ADDED: 'Task added successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
  ERROR_LOADING_TASKS: 'Error loading tasks',
  ERROR_SAVING_TASKS: 'Error saving tasks',
} as const;

// Error messages
export const ERRORS = {
  INVALID_TASK_ID: 'Invalid task ID',
  INVALID_TASK_DATA: 'Invalid task data',
  INVALID_PRIORITY: 'Invalid priority level',
  TASK_NOT_FOUND: 'Task not found',
  STORAGE_ERROR: 'Storage error occurred',
} as const;
