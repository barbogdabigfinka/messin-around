import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTasks } from '../useTasks';

function TestTasks() {
  const { tasks, addTask, toggleTask, updateTask, deleteTask } = useTasks();
  return (
    <div>
      <div>count:{tasks.length}</div>
      <button onClick={() => addTask('X from test')}>add</button>
      <button onClick={() => tasks[0] && toggleTask(tasks[0].id)}>toggle</button>
      <button onClick={() => tasks[0] && updateTask(tasks[0].id, { title: 'updated' })}>update</button>
      <button onClick={() => tasks[0] && deleteTask(tasks[0].id)}>delete</button>
    </div>
  );
}

describe('useTasks hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('full lifecycle: add, update, toggle, delete', async () => {
    const user = userEvent.setup();
    render(<TestTasks />);
    const addBtn = screen.getByRole('button', { name: /add/i });
    await user.click(addBtn);
    expect(screen.getByText(/count:1/)).toBeInTheDocument();

    const updateBtn = screen.getByRole('button', { name: /update/i });
    await user.click(updateBtn);

    const toggleBtn = screen.getByRole('button', { name: /toggle/i });
    await user.click(toggleBtn);

    const deleteBtn = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteBtn);

    expect(screen.getByText(/count:0/)).toBeInTheDocument();
  });
});
