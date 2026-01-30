import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from '../TaskList';
import type { Task } from '../../types';

const tasks: Task[] = [
  { id: 1, title: 'A', completed: false, createdAt: new Date().toISOString(), priority: 'low', category: 'General' },
  { id: 2, title: 'B', completed: true, createdAt: new Date().toISOString(), priority: 'high', category: 'Work' },
];

describe('TaskList', () => {
  test('renders task items', () => {
    render(<TaskList tasks={tasks} onToggle={() => {}} onDelete={() => {}} onEdit={() => {}} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});
