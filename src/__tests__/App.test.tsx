import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';

describe('App smoke test', () => {
  test('renders header and theme toggle', () => {
    render(<App />);
    expect(screen.getByText(/Task Manager/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle theme|☀️|🌙/i })).toBeTruthy();
  });
});
