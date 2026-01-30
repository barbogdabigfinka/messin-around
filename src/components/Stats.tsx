import React from 'react';
import { TaskStats } from '../types/index';
import '../styles/Stats.css';

interface StatsProps {
  stats: TaskStats;
}

/**
 * Stats Component
 * Displays task statistics and metrics
 */
export default function Stats({ stats }: StatsProps) {
  const completionRate = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="stats-container">
      <div className="stat-card total">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
      </div>

      <div className="stat-card pending">
        <div className="stat-icon">⏳</div>
        <div className="stat-content">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="stat-card completed">
        <div className="stat-icon">✓</div>
        <div className="stat-content">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="stat-card completion">
        <div className="stat-icon">🎯</div>
        <div className="stat-content">
          <div className="stat-value">{completionRate}%</div>
          <div className="stat-label">Completion</div>
        </div>
      </div>

      <div className="stat-card priority-breakdown">
        <div className="stat-icon">⚡</div>
        <div className="stat-content">
          <div className="stat-label">Priorities (Pending)</div>
          <div className="priority-stats">
            <span>🟢 {stats.byPriority.low}</span>
            <span>🟡 {stats.byPriority.medium}</span>
            <span>🔴 {stats.byPriority.high}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
