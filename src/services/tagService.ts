/**
 * Tag management service
 * Handles tag operations and persistence
 */

import { Task } from '../types/index';
import TaskService from './taskService';

/**
 * TagService - Centralized business logic for tag operations
 */
class TagService {
  /**
   * Get all unique tags from all tasks
   * @returns Array of unique tags sorted alphabetically
   */
  static getAllTags(): string[] {
    const allTags = new Set<string>();
    const tasks = TaskService.getAllTasks();

    tasks.forEach(task => {
      if (task.tags && Array.isArray(task.tags)) {
        task.tags.forEach(tag => {
          const trimmed = tag.trim();
          if (trimmed) {
            allTags.add(trimmed);
          }
        });
      }
    });

    return Array.from(allTags).sort();
  }

  /**
   * Get tags with their usage count
   * @returns Record mapping tags to their count
   */
  static getTagStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    const tasks = TaskService.getAllTasks();

    tasks.forEach(task => {
      if (task.tags && Array.isArray(task.tags)) {
        task.tags.forEach(tag => {
          const trimmedTag = tag.trim();
          stats[trimmedTag] = (stats[trimmedTag] || 0) + 1;
        });
      }
    });

    return stats;
  }

  /**
   * Add a tag to a task
   * @param taskId Task ID
   * @param tag Tag to add
   * @returns Updated task or null on error
   */
  static addTagToTask(taskId: number, tag: string): Task | null {
    if (!tag.trim()) {
      console.warn('Tag cannot be empty');
      return null;
    }

    const tasks = TaskService.getAllTasks();
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      console.warn('Task not found');
      return null;
    }

    const trimmedTag = tag.trim();

    // Avoid duplicate tags
    if (task.tags?.includes(trimmedTag)) {
      return task;
    }

    const updatedTags = [...(task.tags || []), trimmedTag];
    return TaskService.updateTask(taskId, { tags: updatedTags });
  }

  /**
   * Remove a tag from a task
   * @param taskId Task ID
   * @param tag Tag to remove
   * @returns Updated task or null on error
   */
  static removeTagFromTask(taskId: number, tag: string): Task | null {
    const tasks = TaskService.getAllTasks();
    const task = tasks.find(t => t.id === taskId);

    if (!task || !task.tags) {
      return task || null;
    }

    const updatedTags = task.tags.filter(t => t !== tag);
    return TaskService.updateTask(taskId, { tags: updatedTags });
  }

  /**
   * Replace all tags on a task
   * @param taskId Task ID
   * @param newTags New array of tags
   * @returns Updated task or null on error
   */
  static setTaskTags(taskId: number, newTags: string[]): Task | null {
    if (!Array.isArray(newTags)) {
      console.warn('Tags must be an array');
      return null;
    }

    const validTags = newTags
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    return TaskService.updateTask(taskId, { tags: validTags });
  }

  /**
   * Get tasks with a specific tag
   * @param tag Tag to filter by
   * @returns Array of tasks with the specified tag
   */
  static getTasksByTag(tag: string): Task[] {
    const tasks = TaskService.getAllTasks();
    return tasks.filter(task => task.tags?.includes(tag) || false);
  }
}

export default TagService;
