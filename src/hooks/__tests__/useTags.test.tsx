/**
 * Tests for Tag management hooks
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTags, useTagStats } from '../../hooks/useTags';
import TaskService from '../../services/taskService';
import StorageService from '../../services/storageService';
import { Task } from '../../types/index';

describe('useTags Hook', () => {
  beforeEach(() => {
    StorageService.setItem('tasks_v1', []);
  });

  it('should initialize with empty tags', async () => {
    const { result } = renderHook(() => useTags([]));

    await waitFor(() => {
      expect(result.current.tags).toBeDefined();
    });
  });

  it('should load tags from tasks', async () => {
    TaskService.addTask('Task 1', 'medium', 'General');
    TaskService.updateTask(1, { tags: ['work', 'urgent'] });

    const tasks = TaskService.getAllTasks();
    const { result } = renderHook(() => useTags(tasks));

    await waitFor(() => {
      expect(result.current.tags.length).toBeGreaterThan(0);
    });
  });

  it('should add tag to task', async () => {
    TaskService.addTask('Task 1', 'medium', 'General');
    const tasks = TaskService.getAllTasks();

    const { result } = renderHook(() => useTags(tasks));

    act(() => {
      result.current.addTagToTask(1, 'urgent');
    });

    const updated = TaskService.getTaskById(1);
    expect(updated?.tags).toContain('urgent');
  });

  it('should clear error when clearing', async () => {
    const { result } = renderHook(() => useTags([]));

    act(() => {
      result.current.addTagToTask(999, 'tag');
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});

describe('useTagStats Hook', () => {
  beforeEach(() => {
    StorageService.setItem('tasks_v1', []);
  });

  it('should return empty stats for no tags', () => {
    const { result } = renderHook(() => useTagStats([]));

    expect(result.current).toEqual({});
  });

  it('should count tag usage', () => {
    TaskService.addTask('Task 1', 'medium', 'General');
    TaskService.addTask('Task 2', 'medium', 'General');
    TaskService.addTask('Task 3', 'medium', 'General');

    TaskService.updateTask(1, { tags: ['work', 'urgent'] });
    TaskService.updateTask(2, { tags: ['work'] });
    TaskService.updateTask(3, { tags: ['personal'] });

    const tasks = TaskService.getAllTasks();
    const { result } = renderHook(() => useTagStats(tasks));

    expect(result.current).toEqual({
      work: 2,
      urgent: 1,
      personal: 1,
    });
  });
});
