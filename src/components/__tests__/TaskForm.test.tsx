import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../TaskForm';

describe('TaskForm', () => {
  test('calls onAdd with correct values', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TaskForm onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('Add a new task...');
    await user.type(input, 'New Task');
    const addButton = screen.getByLabelText('Add new task');
    await user.click(addButton);

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith('New Task', 'medium', 'General', undefined);
  });
});
