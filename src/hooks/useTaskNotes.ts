/**
 * Custom hooks for task notes and reminders
 */

import { useState, useCallback } from 'react';
import TaskService from '../services/taskService';

/**
 * Hook for managing task notes
 * @param taskId Task ID
 * @param initialNotes Initial notes content
 * @returns Notes management functions
 */
export function useTaskNotes(taskId: number, initialNotes?: string) {
  const [notes, setNotes] = useState(initialNotes || '');
  const [error, setError] = useState<string | null>(null);

  const saveNotes = useCallback(
    (content: string): boolean => {
      try {
        const updated = TaskService.setTaskNotes(taskId, content);
        if (updated) {
          setNotes(updated.notes || '');
          setError(null);
          return true;
        }
      } catch (err) {
        setError('Failed to save notes');
        console.error(err);
      }
      return false;
    },
    [taskId]
  );

  const clearNotes = useCallback((): boolean => {
    return saveNotes('');
  }, [saveNotes]);

  return {
    notes,
    error,
    saveNotes,
    clearNotes,
    clearError: () => setError(null),
  };
}

/**
 * Hook for managing task reminders
 * @param taskId Task ID
 * @param initialRemindersEnabled Initial reminder state
 * @returns Reminder management functions
 */
export function useTaskReminders(taskId: number, initialRemindersEnabled?: boolean) {
  const [remindersEnabled, setRemindersEnabled] = useState(initialRemindersEnabled || false);
  const [error, setError] = useState<string | null>(null);

  const toggleReminders = useCallback((): boolean => {
    try {
      const updated = TaskService.setReminders(taskId, !remindersEnabled);
      if (updated) {
        setRemindersEnabled(updated.remindersEnabled || false);
        setError(null);
        return true;
      }
    } catch (err) {
      setError('Failed to update reminders');
      console.error(err);
    }
    return false;
  }, [taskId, remindersEnabled]);

  const enableReminders = useCallback((): boolean => {
    if (remindersEnabled) return true;
    try {
      const updated = TaskService.setReminders(taskId, true);
      if (updated) {
        setRemindersEnabled(true);
        setError(null);
        return true;
      }
    } catch (err) {
      setError('Failed to enable reminders');
      console.error(err);
    }
    return false;
  }, [taskId, remindersEnabled]);

  const disableReminders = useCallback((): boolean => {
    if (!remindersEnabled) return true;
    try {
      const updated = TaskService.setReminders(taskId, false);
      if (updated) {
        setRemindersEnabled(false);
        setError(null);
        return true;
      }
    } catch (err) {
      setError('Failed to disable reminders');
      console.error(err);
    }
    return false;
  }, [taskId, remindersEnabled]);

  return {
    remindersEnabled,
    error,
    toggleReminders,
    enableReminders,
    disableReminders,
    clearError: () => setError(null),
  };
}
