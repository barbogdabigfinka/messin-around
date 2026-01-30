/**
 * Custom hooks for tag management
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Task } from '../types/index';
import TagService from '../services/tagService';

/**
 * Hook for managing task tags
 * @param tasks Current tasks array
 * @returns Tag management functions and state
 */
export function useTags(tasks: Task[]) {
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Update tags when tasks change
  useEffect(() => {
    try {
      const allTags = TagService.getAllTags();
      setTags(allTags);
      setError(null);
    } catch (err) {
      setError('Failed to load tags');
      console.error(err);
    }
  }, [tasks]);

  const addTagToTask = useCallback(
    (taskId: number, tag: string): Task | null => {
      try {
        const updated = TagService.addTagToTask(taskId, tag);
        if (updated) {
          setError(null);
          return updated;
        }
      } catch (err) {
        setError('Failed to add tag');
        console.error(err);
      }
      return null;
    },
    []
  );

  const removeTagFromTask = useCallback(
    (taskId: number, tag: string): Task | null => {
      try {
        const updated = TagService.removeTagFromTask(taskId, tag);
        if (updated) {
          setError(null);
          return updated;
        }
      } catch (err) {
        setError('Failed to remove tag');
        console.error(err);
      }
      return null;
    },
    []
  );

  const setTaskTags = useCallback(
    (taskId: number, newTags: string[]): Task | null => {
      try {
        const updated = TagService.setTaskTags(taskId, newTags);
        if (updated) {
          setError(null);
          return updated;
        }
      } catch (err) {
        setError('Failed to set tags');
        console.error(err);
      }
      return null;
    },
    []
  );

  return {
    tags,
    error,
    addTagToTask,
    removeTagFromTask,
    setTaskTags,
    clearError: () => setError(null),
  };
}

/**
 * Hook for tag statistics
 * @param tasks Tasks to calculate tag stats from
 * @returns Tag statistics
 */
export function useTagStats(tasks: Task[]): Record<string, number> {
  return useMemo(() => {
    const stats: Record<string, number> = {};

    tasks.forEach(task => {
      if (task.tags && Array.isArray(task.tags)) {
        task.tags.forEach(tag => {
          stats[tag] = (stats[tag] || 0) + 1;
        });
      }
    });

    return stats;
  }, [tasks]);
}
