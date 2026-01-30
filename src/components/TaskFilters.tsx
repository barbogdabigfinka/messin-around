import React from 'react';
import { Task, Priority } from '../types/index';
import '../styles/TaskFilters.css';

interface TaskFiltersProps {
  tasks: Task[];
  searchTerm: string;
  priorityFilter: Priority | 'all';
  categoryFilter: string | 'all';
  onSearchChange: (term: string) => void;
  onPriorityChange: (priority: Priority | 'all') => void;
  onCategoryChange: (category: string | 'all') => void;
}

/**
 * TaskFilters Component
 * Provides search and filter controls for tasks
 */
export default function TaskFilters({
  tasks,
  searchTerm,
  priorityFilter,
  categoryFilter,
  onSearchChange,
  onPriorityChange,
  onCategoryChange,
}: TaskFiltersProps) {
  const categories = [...new Set(tasks.map((t) => t.category))].sort();

  return (
    <div className="filters">
      <div className="filter-search">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="🔍 Search tasks..."
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value as Priority | 'all')}
          className="filter-select"
        >
          <option value="all">All Priorities</option>
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
