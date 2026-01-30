import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTheme } from '../useTheme';

function TestComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span>theme:{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

describe('useTheme hook', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  test('provides theme and toggles', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);
    expect(screen.getByText(/theme:/)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /toggle/i });
    await user.click(btn);
    expect(document.documentElement.getAttribute('data-theme')).toBeTruthy();
  });
});
