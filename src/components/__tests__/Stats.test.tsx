import React from 'react';
import { render, screen } from '@testing-library/react';
import Stats from '../Stats';

const stats = { total: 3, pending: 2, completed: 1, byPriority: { low: 1, medium: 1, high: 0 } };

describe('Stats', () => {
  test('renders metrics', () => {
    render(<Stats stats={stats} />);
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
