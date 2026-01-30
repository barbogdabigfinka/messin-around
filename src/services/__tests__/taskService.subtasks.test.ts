/**
 * Tests for Subtask functionality in TaskService
 */

import { describe, it, expect, beforeEach } from 'vitest';
import TaskService from '../../services/taskService';
import StorageService from '../../services/storageService';

describe('TaskService - Subtasks', () => {
  beforeEach(() => {
    StorageService.setItem('tasks_v1', []);
  });

  describe('addSubtask', () => {
    it('should add subtask to task', () => {
      TaskService.addTask('Parent task', 'medium', 'General');
      const result = TaskService.addSubtask(1, 'Subtask 1');

      expect(result).not.toBeNull();
      expect(result?.subtasks).toHaveLength(1);
      expect(result?.subtasks![0].title).toBe('Subtask 1');
      expect(result?.subtasks![0].completed).toBe(false);
    });

    it('should add multiple subtasks to same task', () => {
      TaskService.addTask('Parent task', 'medium', 'General');
      TaskService.addSubtask(1, 'Subtask 1');
      TaskService.addSubtask(1, 'Subtask 2');
      const task = TaskService.getTaskById(1);

      expect(task?.subtasks).toHaveLength(2);
      expect(task?.subtasks![0].title).toBe('Subtask 1');
      expect(task?.subtasks![1].title).toBe('Subtask 2');
    });

    it('should trim whitespace from subtask title', () => {
      TaskService.addTask('Parent task', 'medium', 'General');
      const result = TaskService.addSubtask(1, '  Subtask  ');

      expect(result?.subtasks![0].title).toBe('Subtask');
    });

    it('should return null for empty subtask title', () => {
      TaskService.addTask('Parent task', 'medium', 'General');
      const result = TaskService.addSubtask(1, '   ');

      expect(result).toBeNull();
    });

    it('should return null for non-existent task', () => {
      const result = TaskService.addSubtask(999, 'Subtask');

      expect(result).toBeNull();
    });

    it('should generate unique IDs for subtasks', () => {
      TaskService.addTask('Parent task', 'medium', 'General');
      const result1 = TaskService.addSubtask(1, 'Subtask 1');
      const result2 = TaskService.addSubtask(1, 'Subtask 2');

      expect(result1?.subtasks![0].id).not.toBe(result2?.subtasks![1].id);
    });
  });

  describe('toggleSubtask', () => {
    it('should toggle subtask completion status', () => {
      TaskService.addTask('Parent task', 'medium', 'General');
      const withSubtask = TaskService.addSubtask(1, 'Subtask 1');
      const subtaskId = withSubtask!.subtasks![0].id;

      const toggled = TaskService.toggleSubtask(1, subtaskId);
      expect(toggled?.subtasks![0].completed).toBe(true);

      const toggledBack = TaskService.toggleSubtask(1, subtaskId);
      expect(toggledBack?.subtasks![0].completed).toBe(false);
    });

    it('should return null if subtask not found', () => {
      TaskService.addTask('Parent task', 'medium', 'General');
      const result = TaskService.toggleSubtask(1, 'nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('deleteSubtask', () => {
    it('should delete subtask from task', () => {
      TaskService.addTask('Parent task', 'medium', 'General');
      const withSubtask = TaskService.addSubtask(1, 'Subtask 1');
      const subtaskId = withSubtask!.subtasks![0].id;

      const result = TaskService.deleteSubtask(1, subtaskId);
      expect(result?.subtasks).toHaveLength(0);
    });

    it('should return null if subtask not found', () => {
      TaskService.addTask('Parent task', 'medium', 'General');
      const result = TaskService.deleteSubtask(1, 'nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('updateSubtaskTitle', () => {
    it('should update subtask title', () => {
      TaskService.addTask('Parent task', 'medium', 'General');
      const withSubtask = TaskService.addSubtask(1, 'Old title');
      const subtaskId = withSubtask!.subtasks![0].id;

      const result = TaskService.updateSubtaskTitle(1, subtaskId, 'New title');
      expect(result?.subtasks![0].title).toBe('New title');
    });

    it('should trim whitespace from new title', () => {
      TaskService.addTask('Parent task', 'medium', 'General');
      const withSubtask = TaskService.addSubtask(1, 'Original');
      const subtaskId = withSubtask!.subtasks![0].id;

      const result = TaskService.updateSubtaskTitle(1, subtaskId, '  New  ');
      expect(result?.subtasks![0].title).toBe('New');
    });

    it('should return null for empty title', () => {
      TaskService.addTask('Parent task', 'medium', 'General');
      const withSubtask = TaskService.addSubtask(1, 'Original');
      const subtaskId = withSubtask!.subtasks![0].id;

      const result = TaskService.updateSubtaskTitle(1, subtaskId, '   ');
      expect(result).toBeNull();
    });
  });

  describe('getSubtaskStats', () => {
    it('should return correct stats for task with subtasks', () => {
      TaskService.addTask('Parent task', 'medium', 'General');
      const withSubtask = TaskService.addSubtask(1, 'Subtask 1');
      const subtaskId1 = withSubtask!.subtasks![0].id;

      TaskService.addSubtask(1, 'Subtask 2');
      TaskService.toggleSubtask(1, subtaskId1);

      const stats = TaskService.getSubtaskStats(1);
      expect(stats?.total).toBe(2);
      expect(stats?.completed).toBe(1);
    });

    it('should return null for non-existent task', () => {
      const stats = TaskService.getSubtaskStats(999);
      expect(stats).toBeNull();
    });

    it('should return 0 stats for task without subtasks', () => {
      TaskService.addTask('Parent task', 'medium', 'General');
      const stats = TaskService.getSubtaskStats(1);

      expect(stats?.total).toBe(0);
      expect(stats?.completed).toBe(0);
    });
  });
});
