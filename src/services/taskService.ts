/**
 * Task management service
 * Handles all task operations and persistence
 */

import { Task, TaskStats, TaskUpdate, Priority, Subtask } from '../types/index';
import { STORAGE_KEYS, ERRORS } from '../constants/config';
import StorageService from './storageService';

/**
 * TaskService - Centralized business logic for task operations
 */
class TaskService {
  /**
   * Load all tasks from storage
   * @returns Array of tasks or empty array on error
   */
  static loadTasks(): Task[] {
    return StorageService.getItem<Task[]>(STORAGE_KEYS.TASKS, []);
  }

  /**
   * Save tasks to storage
   * @param tasks Tasks to save
   * @returns Success status
   */
  private static saveTasks(tasks: Task[]): boolean {
    return StorageService.setItem(STORAGE_KEYS.TASKS, tasks);
  }

  /**
   * Add a new task
   * @param title Task title
   * @param priority Priority level (defaults to 'medium')
   * @param category Category (defaults to 'General')
   * @param dueDate Optional due date
   * @returns Created task or null on error
   */
  static addTask(
    title: string,
    priority: Priority = 'medium',
    category: string = 'General',
    dueDate?: string
  ): Task | null {
    if (!title.trim()) {
      console.warn('Task title cannot be empty');
      return null;
    }

    const tasks = this.loadTasks();
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

    const newTask: Task = {
      id: newId,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      priority,
      category,
      ...(dueDate && { dueDate }),
    };

    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  /**
   * Update an existing task
   * @param id Task ID
   * @param updates Fields to update
   * @returns Updated task or null if not found
   */
  static updateTask(id: number, updates: TaskUpdate): Task | null {
    if (!this.isValidId(id)) {
      console.warn(ERRORS.INVALID_TASK_ID);
      return null;
    }

    const tasks = this.loadTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      console.warn(ERRORS.TASK_NOT_FOUND);
      return null;
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      id: tasks[taskIndex].id,
      createdAt: tasks[taskIndex].createdAt,
    };

    tasks[taskIndex] = updatedTask;
    this.saveTasks(tasks);
    return updatedTask;
  }

  /**
   * Toggle task completion status
   * @param id Task ID
   * @returns Updated task or null if not found
   */
  static toggleTask(id: number): Task | null {
    const task = this.getTaskById(id);
    if (!task) return null;
    return this.updateTask(id, { completed: !task.completed });
  }

  /**
   * Delete a task
   * @param id Task ID
   * @returns Success status
   */
  static deleteTask(id: number): boolean {
    if (!this.isValidId(id)) {
      console.warn(ERRORS.INVALID_TASK_ID);
      return false;
    }

    const tasks = this.loadTasks();
    const filtered = tasks.filter(t => t.id !== id);

    if (filtered.length === tasks.length) {
      console.warn(ERRORS.TASK_NOT_FOUND);
      return false;
    }

    return this.saveTasks(filtered);
  }

  /**
   * Get a task by ID
   * @param id Task ID
   * @returns Task or null if not found
   */
  static getTaskById(id: number): Task | null {
    const tasks = this.loadTasks();
    return tasks.find(t => t.id === id) || null;
  }

  /**
   * Get all tasks
   * @returns Array of all tasks
   */
  static getAllTasks(): Task[] {
    return this.loadTasks();
  }

  /**
   * Get filtered tasks based on criteria
   * @param searchTerm Search in task titles
   * @param priority Filter by priority
   * @param category Filter by category
   * @returns Filtered tasks
   */
  static getFilteredTasks(
    searchTerm = '',
    priority: Priority | 'all' = 'all',
    category: string | 'all' = 'all'
  ): Task[] {
    const tasks = this.loadTasks();

    return tasks.filter(task => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPriority = priority === 'all' || task.priority === priority;
      const matchesCategory = category === 'all' || task.category === category;

      return matchesSearch && matchesPriority && matchesCategory;
    });
  }

  /**
   * Get task statistics
   * @returns Statistics object with counts and breakdown
   */
  static getStats(): TaskStats {
    const tasks = this.loadTasks();
    const completed = tasks.filter(t => t.completed);
    const pending = tasks.filter(t => !t.completed);

    return {
      total: tasks.length,
      completed: completed.length,
      pending: pending.length,
      byPriority: {
        low: pending.filter(t => t.priority === 'low').length,
        medium: pending.filter(t => t.priority === 'medium').length,
        high: pending.filter(t => t.priority === 'high').length,
      },
    };
  }

  /**
   * Get all unique categories
   * @returns Sorted array of unique categories
   */
  static getCategories(): string[] {
    const tasks = this.loadTasks();
    const categories = [...new Set(tasks.map(t => t.category))];
    return categories.sort();
  }

  /**
   * Clear all tasks (use with caution)
   * @returns Success status
   */
  static clearAllTasks(): boolean {
    return this.saveTasks([]);
  }

  /**
   * Validate task ID
   * @param id ID to validate
   * @returns True if valid ID
   */
  private static isValidId(id: unknown): id is number {
    return typeof id === 'number' && id > 0;
  }

  /**
   * Add a subtask to a task
   * @param taskId Task ID
   * @param subtaskTitle Subtask title
   * @returns Updated task or null on error
   */
  static addSubtask(taskId: number, subtaskTitle: string): Task | null {
    if (!subtaskTitle.trim()) {
      console.warn('Subtask title cannot be empty');
      return null;
    }

    const task = this.getTaskById(taskId);
    if (!task) {
      console.warn(ERRORS.TASK_NOT_FOUND);
      return null;
    }

    const newSubtask: Subtask = {
      id: `${Date.now()}-${Math.random()}`,
      title: subtaskTitle.trim(),
      completed: false,
    };

    const subtasks = [...(task.subtasks || []), newSubtask];
    return this.updateTask(taskId, { subtasks });
  }

  /**
   * Toggle subtask completion status
   * @param taskId Task ID
   * @param subtaskId Subtask ID
   * @returns Updated task or null on error
   */
  static toggleSubtask(taskId: number, subtaskId: string): Task | null {
    const task = this.getTaskById(taskId);
    if (!task || !task.subtasks) {
      console.warn('Task or subtask not found');
      return null;
    }

    const updatedSubtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    if (updatedSubtasks === task.subtasks) {
      console.warn('Subtask not found');
      return null;
    }

    return this.updateTask(taskId, { subtasks: updatedSubtasks });
  }

  /**
   * Delete a subtask
   * @param taskId Task ID
   * @param subtaskId Subtask ID
   * @returns Updated task or null on error
   */
  static deleteSubtask(taskId: number, subtaskId: string): Task | null {
    const task = this.getTaskById(taskId);
    if (!task || !task.subtasks) {
      console.warn('Task or subtask not found');
      return null;
    }

    const updatedSubtasks = task.subtasks.filter(st => st.id !== subtaskId);

    if (updatedSubtasks.length === task.subtasks.length) {
      console.warn('Subtask not found');
      return null;
    }

    return this.updateTask(taskId, { subtasks: updatedSubtasks });
  }

  /**
   * Update subtask title
   * @param taskId Task ID
   * @param subtaskId Subtask ID
   * @param newTitle New title
   * @returns Updated task or null on error
   */
  static updateSubtaskTitle(
    taskId: number,
    subtaskId: string,
    newTitle: string
  ): Task | null {
    if (!newTitle.trim()) {
      console.warn('Subtask title cannot be empty');
      return null;
    }

    const task = this.getTaskById(taskId);
    if (!task || !task.subtasks) {
      console.warn('Task or subtask not found');
      return null;
    }

    const updatedSubtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, title: newTitle.trim() } : st
    );

    return this.updateTask(taskId, { subtasks: updatedSubtasks });
  }

  /**
   * Get subtask completion stats for a task
   * @param taskId Task ID
   * @returns Object with total and completed subtasks count
   */
  static getSubtaskStats(
    taskId: number
  ): { total: number; completed: number } | null {
    const task = this.getTaskById(taskId);
    if (!task) return null;

    const subtasks = task.subtasks || [];
    const completed = subtasks.filter(st => st.completed).length;

    return {
      total: subtasks.length,
      completed,
    };
  }

  /**
   * Add or update task notes
   * @param taskId Task ID
   * @param notes Notes content
   * @returns Updated task or null on error
   */
  static setTaskNotes(taskId: number, notes: string): Task | null {
    if (!this.isValidId(taskId)) {
      console.warn(ERRORS.INVALID_TASK_ID);
      return null;
    }

    return this.updateTask(taskId, { notes: notes.trim() });
  }

  /**
   * Get task notes
   * @param taskId Task ID
   * @returns Notes content (empty string if no notes) or null if task not found
   */
  static getTaskNotes(taskId: number): string | null {
    const task = this.getTaskById(taskId);
    if (!task) return null;
    return task.notes || '';
  }

  /**
   * Enable or disable reminders for a task
   * @param taskId Task ID
   * @param enabled Whether reminders should be enabled
   * @returns Updated task or null on error
   */
  static setReminders(taskId: number, enabled: boolean): Task | null {
    if (!this.isValidId(taskId)) {
      console.warn(ERRORS.INVALID_TASK_ID);
      return null;
    }

    return this.updateTask(taskId, { remindersEnabled: enabled });
  }
}

export default TaskService;
