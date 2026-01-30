/**
 * Custom hooks for recurring tasks
 */

import { useState, useCallback, useEffect } from 'react';
import { Task, RecurrenceFrequency } from '../types/index';
import RecurringTaskService from '../services/recurringTaskService';

/**
 * Hook for managing recurring tasks
 * @param tasks Current tasks array
 * @returns Recurring task management functions
 */
export function useRecurringTasks(tasks: Task[]) {
  const [recurringTasks, setRecurringTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Update recurring tasks when tasks change
  useEffect(() => {
    try {
      const recurring = RecurringTaskService.getRecurringTasks();
      setRecurringTasks(recurring);
      setError(null);
    } catch (err) {
      setError('Failed to load recurring tasks');
      console.error(err);
    }
  }, [tasks]);

  const makeTaskRecurring = useCallback(
    (taskId: number, frequency: RecurrenceFrequency): Task | null => {
      try {
        const updated = RecurringTaskService.makeTaskRecurring(taskId, frequency);
        if (updated) {
          setError(null);
          return updated;
        }
      } catch (err) {
        setError('Failed to make task recurring');
        console.error(err);
      }
      return null;
    },
    []
  );

  const stopTaskRecurring = useCallback((taskId: number): Task | null => {
    try {
      const updated = RecurringTaskService.stopTaskRecurring(taskId);
      if (updated) {
        setError(null);
        return updated;
      }
    } catch (err) {
      setError('Failed to stop recurring task');
      console.error(err);
    }
    return null;
  }, []);

  const generateNextOccurrence = useCallback(
    (taskId: number): Task | null => {
      try {
        const task = recurringTasks.find(t => t.id === taskId);
        if (!task) return null;

        const newTask = RecurringTaskService.generateNextOccurrence(task);
        if (newTask) {
          setError(null);
          return newTask;
        }
      } catch (err) {
        setError('Failed to generate next occurrence');
        console.error(err);
      }
      return null;
    },
    [recurringTasks]
  );

  const autoGenerateRecurringTasks = useCallback((): Task[] => {
    try {
      const newTasks = RecurringTaskService.autoGenerateRecurringTasks();
      setError(null);
      return newTasks;
    } catch (err) {
      setError('Failed to auto-generate recurring tasks');
      console.error(err);
      return [];
    }
  }, []);

  return {
    recurringTasks,
    error,
    makeTaskRecurring,
    stopTaskRecurring,
    generateNextOccurrence,
    autoGenerateRecurringTasks,
    clearError: () => setError(null),
  };
}
