/**
 * Tests for RecurringTaskService
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import RecurringTaskService from '../../services/recurringTaskService';
import TaskService from '../../services/taskService';
import StorageService from '../../services/storageService';

describe('RecurringTaskService', () => {
  beforeEach(() => {
    // Clear storage before each test
    StorageService.setItem('tasks_v1', []);
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('makeTaskRecurring', () => {
    it('should make a task recurring with valid frequency', () => {
      TaskService.addTask('Daily task', 'medium', 'General', '2024-01-15');
      const result = RecurringTaskService.makeTaskRecurring(1, 'daily');

      expect(result).not.toBeNull();
      expect(result?.recurringConfig?.frequency).toBe('daily');
      expect(result?.recurringConfig?.isActive).toBe(true);
    });

    it('should support all frequency options', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.addTask('Task 2', 'medium', 'General');
      TaskService.addTask('Task 3', 'medium', 'General');
      TaskService.addTask('Task 4', 'medium', 'General');

      const frequencies = ['daily', 'weekly', 'monthly', 'yearly'] as const;
      frequencies.forEach((freq, idx) => {
        const result = RecurringTaskService.makeTaskRecurring(idx + 1, freq);
        expect(result?.recurringConfig?.frequency).toBe(freq);
      });
    });

    it('should return null for invalid frequency', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      const result = RecurringTaskService.makeTaskRecurring(1, 'invalid' as any);

      expect(result).toBeNull();
    });
  });

  describe('stopTaskRecurring', () => {
    it('should stop recurring task', () => {
      TaskService.addTask('Task 1', 'medium', 'General', '2024-01-15');
      RecurringTaskService.makeTaskRecurring(1, 'daily');

      const result = RecurringTaskService.stopTaskRecurring(1);
      expect(result?.recurringConfig).toBeUndefined();
    });
  });

  describe('getRecurringTasks', () => {
    it('should return only active recurring tasks', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.addTask('Task 2', 'medium', 'General');
      TaskService.addTask('Task 3', 'medium', 'General');

      RecurringTaskService.makeTaskRecurring(1, 'daily');
      RecurringTaskService.makeTaskRecurring(2, 'weekly');

      const recurring = RecurringTaskService.getRecurringTasks();
      expect(recurring).toHaveLength(2);
      expect(recurring.map(t => t.id)).toEqual([1, 2]);
    });

    it('should return empty array when no recurring tasks', () => {
      TaskService.addTask('Task 1', 'medium', 'General');

      const recurring = RecurringTaskService.getRecurringTasks();
      expect(recurring).toEqual([]);
    });
  });

  describe('generateNextOccurrence', () => {
    it('should generate next occurrence with updated due date', () => {
      TaskService.addTask('Task 1', 'high', 'Work', '2024-01-15');
      RecurringTaskService.makeTaskRecurring(1, 'daily');

      const task = TaskService.getTaskById(1)!;
      const newTask = RecurringTaskService.generateNextOccurrence(task);

      expect(newTask).not.toBeNull();
      expect(newTask?.dueDate).toBe('2024-01-16T00:00:00.000Z');
    });

    it('should preserve task properties in new occurrence', () => {
      TaskService.addTask('Task 1', 'high', 'Work', '2024-01-15');
      TaskService.updateTask(1, {
        tags: ['important', 'urgent'],
        notes: 'This is a note',
      });
      RecurringTaskService.makeTaskRecurring(1, 'daily');

      const task = TaskService.getTaskById(1)!;
      const newTask = RecurringTaskService.generateNextOccurrence(task);

      expect(newTask?.title).toBe('Task 1');
      expect(newTask?.priority).toBe('high');
      expect(newTask?.category).toBe('Work');
      expect(newTask?.tags).toEqual(['important', 'urgent']);
      expect(newTask?.notes).toBe('This is a note');
    });

    it('should reset subtasks in new occurrence', () => {
      TaskService.addTask('Task 1', 'medium', 'General', '2024-01-15');
      TaskService.addSubtask(1, 'Subtask 1');
      TaskService.toggleSubtask(1, TaskService.getTaskById(1)!.subtasks![0].id);
      RecurringTaskService.makeTaskRecurring(1, 'daily');

      const task = TaskService.getTaskById(1)!;
      const newTask = RecurringTaskService.generateNextOccurrence(task);

      expect(newTask?.subtasks).toHaveLength(1);
      expect(newTask?.subtasks![0].completed).toBe(false);
    });

    it('should return null for non-recurring task', () => {
      TaskService.addTask('Task 1', 'medium', 'General');

      const task = TaskService.getTaskById(1)!;
      const result = RecurringTaskService.generateNextOccurrence(task);

      expect(result).toBeNull();
    });
  });

  describe('Date calculations', () => {
    it('should calculate daily next due date correctly', () => {
      TaskService.addTask('Task 1', 'medium', 'General', '2024-01-15');
      RecurringTaskService.makeTaskRecurring(1, 'daily');

      const task = TaskService.getTaskById(1)!;
      const newTask = RecurringTaskService.generateNextOccurrence(task);

      const currentDate = new Date('2024-01-15T00:00:00.000Z');
      const nextDate = new Date(newTask!.dueDate!);
      const diffTime = nextDate.getTime() - currentDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      expect(diffDays).toBeCloseTo(1, 0);
    });

    it('should calculate weekly next due date correctly', () => {
      TaskService.addTask('Task 1', 'medium', 'General', '2024-01-15');
      RecurringTaskService.makeTaskRecurring(1, 'weekly');

      const task = TaskService.getTaskById(1)!;
      const newTask = RecurringTaskService.generateNextOccurrence(task);

      const currentDate = new Date('2024-01-15T00:00:00.000Z');
      const nextDate = new Date(newTask!.dueDate!);
      const diffTime = nextDate.getTime() - currentDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      expect(diffDays).toBeCloseTo(7, 0);
    });

    it('should calculate monthly next due date correctly', () => {
      TaskService.addTask('Task 1', 'medium', 'General', '2024-01-15');
      RecurringTaskService.makeTaskRecurring(1, 'monthly');

      const task = TaskService.getTaskById(1)!;
      const newTask = RecurringTaskService.generateNextOccurrence(task);

      const nextDate = new Date(newTask!.dueDate!);
      // Check that month incremented
      expect(nextDate.getMonth()).toBe(1); // February (0-indexed)
    });
  });
});
