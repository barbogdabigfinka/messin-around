/**
 * Recurring task management service
 * Handles auto-generation of recurring tasks
 */

import { Task, RecurrenceFrequency, RecurringTaskConfig } from '../types/index';
import TaskService from './taskService';

/**
 * RecurringTaskService - Handles recurring task operations
 */
class RecurringTaskService {
  /**
   * Create a recurring task configuration
   * @param taskId Task to make recurring
   * @param frequency Recurrence frequency
   * @returns Updated task or null on error
   */
  static makeTaskRecurring(
    taskId: number,
    frequency: RecurrenceFrequency
  ): Task | null {
    if (!['daily', 'weekly', 'monthly', 'yearly'].includes(frequency)) {
      console.warn('Invalid recurrence frequency');
      return null;
    }

    const config: RecurringTaskConfig = {
      frequency,
      lastGenerated: new Date().toISOString(),
      isActive: true,
    };

    return TaskService.updateTask(taskId, { recurringConfig: config });
  }

  /**
   * Stop a task from recurring
   * @param taskId Task ID
   * @returns Updated task or null on error
   */
  static stopTaskRecurring(taskId: number): Task | null {
    return TaskService.updateTask(taskId, { recurringConfig: undefined });
  }

  /**
   * Get all recurring tasks
   * @returns Array of active recurring tasks
   */
  static getRecurringTasks(): Task[] {
    const tasks = TaskService.getAllTasks();
    return tasks.filter(
      task => task.recurringConfig?.isActive === true
    );
  }

  /**
   * Generate next occurrence of a recurring task
   * @param task Recurring task
   * @returns New task with updated due date or null on error
   */
  static generateNextOccurrence(task: Task): Task | null {
    if (!task.recurringConfig?.isActive) {
      console.warn('Task is not recurring or is inactive');
      return null;
    }

    const newDueDate = this.calculateNextDueDate(
      task.dueDate || new Date().toISOString(),
      task.recurringConfig.frequency
    );

    const newTask = TaskService.addTask(
      task.title,
      task.priority,
      task.category,
      newDueDate
    );

    if (newTask && task.tags) {
      newTask.tags = task.tags;
    }
    if (newTask && task.notes) {
      newTask.notes = task.notes;
    }
    if (newTask && task.subtasks) {
      newTask.subtasks = task.subtasks.map(st => ({
        ...st,
        completed: false,
      }));
    }
    if (newTask && task.recurringConfig) {
      newTask.recurringConfig = task.recurringConfig;
    }

    if (newTask) {
      TaskService.updateTask(
        task.id,
        {
          recurringConfig: {
            ...task.recurringConfig,
            lastGenerated: new Date().toISOString(),
          },
        }
      );
    }

    return newTask;
  }

  /**
   * Auto-generate recurring task instances
   * Checks all recurring tasks and generates new ones if needed
   * @returns Array of newly created tasks
   */
  static autoGenerateRecurringTasks(): Task[] {
    const recurringTasks = this.getRecurringTasks();
    const newTasks: Task[] = [];

    recurringTasks.forEach(task => {
      const lastGenerated = new Date(
        task.recurringConfig?.lastGenerated || 0
      );
      const now = new Date();

      const shouldGenerate = this.shouldGenerateNextOccurrence(
        lastGenerated,
        task.recurringConfig?.frequency || 'daily'
      );

      if (shouldGenerate) {
        const newTask = this.generateNextOccurrence(task);
        if (newTask) {
          newTasks.push(newTask);
        }
      }
    });

    return newTasks;
  }

  /**
   * Calculate next due date based on frequency
   * @param currentDate Current/last due date
   * @param frequency Recurrence frequency
   * @returns ISO 8601 date string of next occurrence
   */
  private static calculateNextDueDate(
    currentDate: string,
    frequency: RecurrenceFrequency
  ): string {
    const date = new Date(currentDate);

    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }

    return date.toISOString();
  }

  /**
   * Check if next occurrence should be generated
   * @param lastGenerated Last generation date
   * @param frequency Recurrence frequency
   * @returns true if next occurrence should be generated
   */
  private static shouldGenerateNextOccurrence(
    lastGenerated: Date,
    frequency: RecurrenceFrequency
  ): boolean {
    const now = new Date();
    const timeDiff = now.getTime() - lastGenerated.getTime();

    switch (frequency) {
      case 'daily':
        return timeDiff >= 24 * 60 * 60 * 1000; // 24 hours
      case 'weekly':
        return timeDiff >= 7 * 24 * 60 * 60 * 1000; // 7 days
      case 'monthly':
        return timeDiff >= 30 * 24 * 60 * 60 * 1000; // 30 days
      case 'yearly':
        return timeDiff >= 365 * 24 * 60 * 60 * 1000; // 365 days
      default:
        return false;
    }
  }
}

export default RecurringTaskService;
