/**
 * Application-wide type definitions
 */

export type Priority = 'low' | 'medium' | 'high';
export type SortBy = 'date' | 'priority' | 'title';
export type Theme = 'light' | 'dark';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Subtask for task checklists
 * @interface Subtask
 */
export interface Subtask {
  /** Unique identifier */
  id: string;
  /** Subtask title */
  title: string;
  /** Completion status */
  completed: boolean;
}

/**
 * Recurring task configuration
 * @interface RecurringTaskConfig
 */
export interface RecurringTaskConfig {
  /** Recurrence frequency */
  frequency: RecurrenceFrequency;
  /** Last generated date in ISO 8601 format */
  lastGenerated: string;
  /** Whether this recurring task is active */
  isActive: boolean;
}

/**
 * Core task interface
 * @interface Task
 */
export interface Task {
  /** Unique identifier */
  id: number;
  /** Task title/description */
  title: string;
  /** Completion status */
  completed: boolean;
  /** ISO 8601 creation timestamp */
  createdAt: string;
  /** Optional due date in ISO 8601 format */
  dueDate?: string;
  /** Priority level */
  priority: Priority;
  /** Task category for organization */
  category: string;
  /** Optional array of tags for categorization */
  tags?: string[];
  /** Optional detailed notes/description */
  notes?: string;
  /** Optional array of subtasks for checklists */
  subtasks?: Subtask[];
  /** Optional recurring task configuration */
  recurringConfig?: RecurringTaskConfig;
  /** Whether this task has reminder notifications enabled */
  remindersEnabled?: boolean;
}

/**
 * Statistics about current tasks
 * @interface TaskStats
 */
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  byPriority: Record<Priority, number>;
  byTag?: Record<string, number>;
  averageSubtasksPerTask?: number;
}

/**
 * Filter criteria for tasks
 * @interface TaskFilters
 */
export interface TaskFilters {
  searchTerm: string;
  priorityFilter: Priority | 'all';
  categoryFilter: string | 'all';
  tagFilter?: string | 'all';
  showRecurringOnly?: boolean;
}

/**
 * Partial task for updates
 * @type TaskUpdate
 */
export type TaskUpdate = Partial<Omit<Task, 'id' | 'createdAt'>>;
