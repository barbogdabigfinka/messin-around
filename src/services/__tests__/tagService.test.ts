/**
 * Tests for TagService
 */

import { describe, it, expect, beforeEach } from 'vitest';
import TagService from '../../services/tagService';
import TaskService from '../../services/taskService';
import StorageService from '../../services/storageService';

describe('TagService', () => {
  beforeEach(() => {
    // Clear storage before each test
    StorageService.setItem('tasks_v1', []);
  });

  describe('getAllTags', () => {
    it('should return empty array when no tasks exist', () => {
      const tags = TagService.getAllTags();
      expect(tags).toEqual([]);
    });

    it('should return unique tags from all tasks', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.addTask('Task 2', 'medium', 'General');
      const task1 = TaskService.getTaskById(1);
      const task2 = TaskService.getTaskById(2);

      if (task1) TaskService.updateTask(1, { tags: ['work', 'urgent'] });
      if (task2) TaskService.updateTask(2, { tags: ['work', 'personal'] });

      const tags = TagService.getAllTags();
      expect(tags).toEqual(['personal', 'urgent', 'work']);
    });

    it('should ignore empty tag strings', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.updateTask(1, { tags: ['work', '', 'personal'] });

      const tags = TagService.getAllTags();
      expect(tags).toEqual(['personal', 'work']);
    });
  });

  describe('getTagStats', () => {
    it('should return empty object when no tasks exist', () => {
      const stats = TagService.getTagStats();
      expect(stats).toEqual({});
    });

    it('should count tag usage correctly', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.addTask('Task 2', 'medium', 'General');
      TaskService.addTask('Task 3', 'medium', 'General');

      TaskService.updateTask(1, { tags: ['work', 'urgent'] });
      TaskService.updateTask(2, { tags: ['work'] });
      TaskService.updateTask(3, { tags: ['personal'] });

      const stats = TagService.getTagStats();
      expect(stats).toEqual({
        work: 2,
        urgent: 1,
        personal: 1,
      });
    });
  });

  describe('addTagToTask', () => {
    it('should add tag to task', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      const result = TagService.addTagToTask(1, 'urgent');

      expect(result).not.toBeNull();
      expect(result?.tags).toContain('urgent');
    });

    it('should not add duplicate tags', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.updateTask(1, { tags: ['work'] });

      const result = TagService.addTagToTask(1, 'work');
      expect(result?.tags?.length).toBe(1);
    });

    it('should trim whitespace from tags', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      const result = TagService.addTagToTask(1, '  urgent  ');

      expect(result?.tags).toContain('urgent');
    });

    it('should return null for invalid task id', () => {
      const result = TagService.addTagToTask(999, 'urgent');
      expect(result).toBeNull();
    });

    it('should return null for empty tag', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      const result = TagService.addTagToTask(1, '   ');

      expect(result).toBeNull();
    });
  });

  describe('removeTagFromTask', () => {
    it('should remove tag from task', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.updateTask(1, { tags: ['work', 'urgent'] });

      const result = TagService.removeTagFromTask(1, 'work');
      expect(result?.tags).toEqual(['urgent']);
    });

    it('should handle removing non-existent tag', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.updateTask(1, { tags: ['work'] });

      const result = TagService.removeTagFromTask(1, 'nonexistent');
      expect(result?.tags).toEqual(['work']);
    });

    it('should return task when task has no tags', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      const result = TagService.removeTagFromTask(1, 'work');

      expect(result).not.toBeNull();
      expect(result?.tags).toBeUndefined();
    });
  });

  describe('setTaskTags', () => {
    it('should replace all tags on task', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.updateTask(1, { tags: ['old', 'tags'] });

      const result = TagService.setTaskTags(1, ['new', 'tags']);
      expect(result?.tags).toEqual(['new', 'tags']);
    });

    it('should remove empty strings from tags', () => {
      TaskService.addTask('Task 1', 'medium', 'General');

      const result = TagService.setTaskTags(1, ['work', '', 'urgent']);
      expect(result?.tags).toEqual(['work', 'urgent']);
    });

    it('should trim whitespace from tags', () => {
      TaskService.addTask('Task 1', 'medium', 'General');

      const result = TagService.setTaskTags(1, ['  work  ', '  urgent  ']);
      expect(result?.tags).toEqual(['work', 'urgent']);
    });

    it('should return null for invalid input', () => {
      TaskService.addTask('Task 1', 'medium', 'General');

      const result = TagService.setTaskTags(1, {} as any);
      expect(result).toBeNull();
    });
  });

  describe('getTasksByTag', () => {
    it('should return all tasks with specific tag', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.addTask('Task 2', 'medium', 'General');
      TaskService.addTask('Task 3', 'medium', 'General');

      TaskService.updateTask(1, { tags: ['work', 'urgent'] });
      TaskService.updateTask(2, { tags: ['work'] });
      TaskService.updateTask(3, { tags: ['personal'] });

      const tasks = TagService.getTasksByTag('work');
      expect(tasks).toHaveLength(2);
      expect(tasks.map(t => t.id)).toEqual([1, 2]);
    });

    it('should return empty array when no tasks have tag', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      const tasks = TagService.getTasksByTag('nonexistent');

      expect(tasks).toEqual([]);
    });
  });
});
