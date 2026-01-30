import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskItem from '../TaskItem';
import type { Task } from '../../types';

const sampleTask: Task = {
  id: 1,
  title: 'Sample',
  completed: false,
  createdAt: new Date().toISOString(),
  priority: 'medium',
  category: 'General',
};

describe('TaskItem', () => {
  test('renders task and buttons work', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();
    const onEdit = vi.fn();

    render(<TaskItem task={sampleTask} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);

    // Title
    expect(screen.getByText('Sample')).toBeInTheDocument();

    // Toggle button
    const toggleBtn = screen.getByTitle(/mark complete|mark incomplete/i);
    await user.click(toggleBtn);
    expect(onToggle).toHaveBeenCalledWith(1);

    // Edit button
    const editBtn = screen.getByTitle('Edit task');
    await user.click(editBtn);
    expect(onEdit).toHaveBeenCalledWith(1);

    // Delete button
    const deleteBtn = screen.getByTitle('Delete task');
    await user.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
