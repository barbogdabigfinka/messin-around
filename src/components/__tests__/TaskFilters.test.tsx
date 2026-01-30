import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskFilters from '../TaskFilters';
import type { Task } from '../../types';

const tasks: Task[] = [
  { id: 1, title: 'A', completed: false, createdAt: new Date().toISOString(), priority: 'low', category: 'General' },
  { id: 2, title: 'B', completed: true, createdAt: new Date().toISOString(), priority: 'high', category: 'Work' },
];

describe('TaskFilters', () => {
  test('renders categories from tasks', () => {
    render(
      <TaskFilters
        tasks={tasks}
        searchTerm=""
        priorityFilter="all"
        categoryFilter="all"
        onSearchChange={() => {}}
        onPriorityChange={() => {}}
        onCategoryChange={() => {}}
      />
    );

    expect(screen.getByPlaceholderText('🔍 Search tasks...')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
  });
});
