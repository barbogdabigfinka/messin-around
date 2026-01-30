import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskEditModal from '../TaskEditModal';
import type { Task } from '../../types';

const task: Task = { id: 1, title: 'Old', completed: false, createdAt: new Date().toISOString(), priority: 'medium', category: 'General' };

describe('TaskEditModal', () => {
  test('renders and saves', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(<TaskEditModal task={task} onSave={onSave} onClose={onClose} />);
    const input = screen.getByPlaceholderText('Task title');
    await user.clear(input);
    await user.type(input, 'New title');
    const saveBtn = screen.getByRole('button', { name: /save/i });
    await user.click(saveBtn);
    expect(onSave).toHaveBeenCalled();
  });
});
