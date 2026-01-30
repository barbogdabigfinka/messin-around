/**
 * Tests for Task Notes and Reminders functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import TaskService from '../../services/taskService';
import StorageService from '../../services/storageService';

describe('TaskService - Notes and Reminders', () => {
  beforeEach(() => {
    StorageService.setItem('tasks_v1', []);
  });

  describe('setTaskNotes', () => {
    it('should set notes for a task', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      const result = TaskService.setTaskNotes(1, 'This is a note');

      expect(result?.notes).toBe('This is a note');
    });

    it('should update existing notes', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.setTaskNotes(1, 'Old note');
      const result = TaskService.setTaskNotes(1, 'New note');

      expect(result?.notes).toBe('New note');
    });

    it('should trim whitespace from notes', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      const result = TaskService.setTaskNotes(1, '  Some notes  ');

      expect(result?.notes).toBe('Some notes');
    });

    it('should clear notes when given empty string', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.setTaskNotes(1, 'Some notes');
      const result = TaskService.setTaskNotes(1, '');

      expect(result?.notes).toBe('');
    });

    it('should return null for invalid task ID', () => {
      const result = TaskService.setTaskNotes(999, 'Note');

      expect(result).toBeNull();
    });
  });

  describe('getTaskNotes', () => {
    it('should retrieve task notes', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.setTaskNotes(1, 'Some notes');

      const notes = TaskService.getTaskNotes(1);
      expect(notes).toBe('Some notes');
    });

    it('should return empty string for task without notes', () => {
      TaskService.addTask('Task 1', 'medium', 'General');

      const notes = TaskService.getTaskNotes(1);
      expect(notes).toBe('');
    });

    it('should return null for non-existent task', () => {
      const notes = TaskService.getTaskNotes(999);
      expect(notes).toBeNull();
    });

    it('should return empty string for explicitly cleared notes', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.setTaskNotes(1, 'Notes');
      TaskService.setTaskNotes(1, '');

      const notes = TaskService.getTaskNotes(1);
      expect(notes).toBe('');
    });
  });

  describe('setReminders', () => {
    it('should enable reminders for a task', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      const result = TaskService.setReminders(1, true);

      expect(result?.remindersEnabled).toBe(true);
    });

    it('should disable reminders for a task', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.setReminders(1, true);
      const result = TaskService.setReminders(1, false);

      expect(result?.remindersEnabled).toBe(false);
    });

    it('should toggle reminders status', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      const enabled = TaskService.setReminders(1, true);
      expect(enabled?.remindersEnabled).toBe(true);

      const disabled = TaskService.setReminders(1, false);
      expect(disabled?.remindersEnabled).toBe(false);
    });

    it('should return null for invalid task ID', () => {
      const result = TaskService.setReminders(999, true);

      expect(result).toBeNull();
    });

    it('should start with reminders disabled', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      const task = TaskService.getTaskById(1);

      expect(task?.remindersEnabled).toBeUndefined();
    });
  });

  describe('Integration - Notes and Reminders with other fields', () => {
    it('should preserve notes and reminders when updating other fields', () => {
      TaskService.addTask('Task 1', 'medium', 'General');
      TaskService.setTaskNotes(1, 'Important note');
      TaskService.setReminders(1, true);

      const updated = TaskService.updateTask(1, {
        title: 'Updated title',
        priority: 'high',
      });

      expect(updated?.notes).toBe('Important note');
      expect(updated?.remindersEnabled).toBe(true);
    });

    it('should handle full task lifecycle with notes and reminders', () => {
      const task1 = TaskService.addTask('Task 1', 'medium', 'Work');
      expect(task1).not.toBeNull();

      const withNotes = TaskService.setTaskNotes(1, 'Complete this ASAP');
      expect(withNotes?.notes).toBe('Complete this ASAP');

      const withReminders = TaskService.setReminders(1, true);
      expect(withReminders?.remindersEnabled).toBe(true);

      const final = TaskService.getTaskById(1);
      expect(final?.notes).toBe('Complete this ASAP');
      expect(final?.remindersEnabled).toBe(true);
    });
  });
});
