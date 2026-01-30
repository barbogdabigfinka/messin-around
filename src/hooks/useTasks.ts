/**
 * Custom React hooks for task management
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Task, TaskFilters, TaskStats } from '../types/index';
import TaskService from '../services/taskService';

/**
 * Hook for managing tasks
 * @returns Task management functions and state
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks on mount
  useEffect(() => {
    try {
      setIsLoading(true);
      const loadedTasks = TaskService.getAllTasks();
      setTasks(loadedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTask = useCallback(
    (title: string, priority: 'low' | 'medium' | 'high' = 'medium', category: string = 'General', dueDate?: string) => {
      try {
        const newTask = TaskService.addTask(title, priority, category, dueDate);
        if (newTask) {
          setTasks(prev => [...prev, newTask]);
          return newTask;
        }
      } catch (err) {
        setError('Failed to add task');
        console.error(err);
      }
      return null;
    },
    []
  );

  const updateTask = useCallback((id: number, updates: Partial<Task>) => {
    try {
      const updated = TaskService.updateTask(id, updates);
      if (updated) {
        setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
        return updated;
      }
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
    return null;
  }, []);

  const deleteTask = useCallback((id: number) => {
    try {
      const success = TaskService.deleteTask(id);
      if (success) {
        setTasks(prev => prev.filter(t => t.id !== id));
        return true;
      }
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
    return false;
  }, []);

  const toggleTask = useCallback((id: number) => {
    try {
      const updated = TaskService.toggleTask(id);
      if (updated) {
        setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
        return updated;
      }
    } catch (err) {
      setError('Failed to toggle task');
      console.error(err);
    }
    return null;
  }, []);

  return {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    clearError: () => setError(null),
  };
}

/**
 * Hook for filtering tasks
 * Pure filtering on in-memory task array (no service calls to prevent redundant loads)
 * @param tasks Tasks to filter
 * @param filters Filter criteria
 * @returns Filtered tasks
 */
export function useFilteredTasks(tasks: Task[], filters: Partial<TaskFilters>) {
  return useMemo(() => {
    let filtered = tasks;

    // Filter by search term
    if (filters.searchTerm?.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower)
      );
    }

    // Filter by priority
    if (filters.priorityFilter && filters.priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priorityFilter);
    }

    // Filter by category
    if (filters.categoryFilter && filters.categoryFilter !== 'all') {
      filtered = filtered.filter(task => task.category === filters.categoryFilter);
    }

    return filtered;
  }, [tasks, filters.searchTerm, filters.priorityFilter, filters.categoryFilter]);
}

/**
 * Hook for task categories
 * @param tasks Tasks to extract categories from
 * @returns Array of unique categories
 */
export function useTaskCategories(tasks: Task[]) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const cats = TaskService.getCategories();
    setCategories(cats);
  }, [tasks]);

  return categories;
}

/**
 * Hook for task statistics
 * Computes statistics from in-memory task array using memoization
 * @param tasks Tasks to calculate stats from
 * @returns Task statistics
 */
export function useTaskStats(tasks: Task[]): TaskStats {
  return useMemo(() => {
    const completed = tasks.filter(t => t.completed);
    const pending = tasks.filter(t => !t.completed);

    return {
      total: tasks.length,
      completed: completed.length,
      pending: pending.length,
      byPriority: {
        low: pending.filter(t => t.priority === 'low').length,
        medium: pending.filter(t => t.priority === 'medium').length,
        high: pending.filter(t => t.priority === 'high').length,
      },
    };
  }, [tasks]);
}
