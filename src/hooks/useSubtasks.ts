/**
 * Custom hooks for subtask management
 */

import { useState, useCallback, useMemo } from 'react';
import { Task, Subtask } from '../types/index';
import TaskService from '../services/taskService';

/**
 * Hook for managing subtasks
 * @param taskId Task ID containing subtasks
 * @param task Task object with subtasks
 * @returns Subtask management functions
 */
export function useSubtasks(taskId: number, task: Task | null) {
  const [error, setError] = useState<string | null>(null);

  const addSubtask = useCallback(
    (title: string): Subtask | null => {
      try {
        const updated = TaskService.addSubtask(taskId, title);
        if (updated) {
          setError(null);
          const newSubtask = updated.subtasks?.find(
            st => st.title === title.trim()
          );
          return newSubtask || null;
        }
      } catch (err) {
        setError('Failed to add subtask');
        console.error(err);
      }
      return null;
    },
    [taskId]
  );

  const toggleSubtask = useCallback(
    (subtaskId: string): boolean => {
      try {
        const updated = TaskService.toggleSubtask(taskId, subtaskId);
        if (updated) {
          setError(null);
          return true;
        }
      } catch (err) {
        setError('Failed to toggle subtask');
        console.error(err);
      }
      return false;
    },
    [taskId]
  );

  const deleteSubtask = useCallback(
    (subtaskId: string): boolean => {
      try {
        const updated = TaskService.deleteSubtask(taskId, subtaskId);
        if (updated) {
          setError(null);
          return true;
        }
      } catch (err) {
        setError('Failed to delete subtask');
        console.error(err);
      }
      return false;
    },
    [taskId]
  );

  const updateSubtaskTitle = useCallback(
    (subtaskId: string, newTitle: string): boolean => {
      try {
        const updated = TaskService.updateSubtaskTitle(
          taskId,
          subtaskId,
          newTitle
        );
        if (updated) {
          setError(null);
          return true;
        }
      } catch (err) {
        setError('Failed to update subtask');
        console.error(err);
      }
      return false;
    },
    [taskId]
  );

  const subtaskStats = useMemo(() => {
    if (!task?.subtasks) {
      return { total: 0, completed: 0 };
    }
    return {
      total: task.subtasks.length,
      completed: task.subtasks.filter(st => st.completed).length,
    };
  }, [task?.subtasks]);

  return {
    subtasks: task?.subtasks || [],
    error,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    updateSubtaskTitle,
    subtaskStats,
    clearError: () => setError(null),
  };
}

/**
 * Hook for computing subtask statistics across all tasks
 * @param tasks All tasks
 * @returns Subtask statistics
 */
export function useSubtaskStats(
  tasks: Task[]
): { totalTasks: number; tasksWithSubtasks: number; averagePerTask: number } {
  return useMemo(() => {
    const tasksWithSubtasks = tasks.filter(t => t.subtasks && t.subtasks.length > 0).length;
    const totalSubtasks = tasks.reduce((sum, t) => sum + (t.subtasks?.length || 0), 0);

    return {
      totalTasks: tasks.length,
      tasksWithSubtasks,
      averagePerTask: tasks.length > 0 ? totalSubtasks / tasks.length : 0,
    };
  }, [tasks]);
}
