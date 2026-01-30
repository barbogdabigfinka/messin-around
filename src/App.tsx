import React, { useState, useMemo } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilters from './components/TaskFilters';
import TaskEditModal from './components/TaskEditModal';
import Stats from './components/Stats';
import { useTasks, useFilteredTasks, useTaskStats } from './hooks/useTasks';
import { useTheme } from './hooks/useTheme';
import { TaskFilters as TaskFilterType } from './types/index';
import './styles/App.css';

/**
 * Main App component
 * Orchestrates state management and layout
 */
export default function App() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask, isLoading, error } = useTasks();
  const { theme, toggleTheme } = useTheme();
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [filters, setFilters] = useState<TaskFilterType>({
    searchTerm: '',
    priorityFilter: 'all',
    categoryFilter: 'all',
  });

  // Get filtered tasks
  const filteredTasks = useFilteredTasks(tasks, filters);

  // Get statistics
  const stats = useTaskStats(tasks);

  // Memoize completion count
  const completedCount = useMemo(
    () => filteredTasks.filter(t => t.completed).length,
    [filteredTasks]
  );

  const handleEditTask = (updates: Record<string, any>) => {
    if (editingTask !== null) {
      updateTask(editingTask, updates);
      // Don't close modal - let user continue editing
      // Modal stays open for immediate feedback
    }
  };

  const editingTaskData = tasks.find(t => t.id === editingTask) || null;

  if (isLoading) {
    return (
      <div className="app" data-theme={theme}>
        <div className="container">
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app" data-theme={theme}>
        <div className="container">
          {/* Header */}
          <header className="header">
            <div className="header-top">
              <div>
                <h1>📝 Task Manager</h1>
                <p className="subtitle">
                  {completedCount} of {filteredTasks.length} tasks completed
                </p>
              </div>
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </header>

          {/* Error display */}
          {error && (
            <div style={{ padding: '12px 32px', color: '#ef4444', fontSize: '13px' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Statistics */}
          <Stats stats={stats} />

          {/* Task form */}
          <TaskForm onAdd={addTask} />

          {/* Filters */}
          <TaskFilters
            tasks={tasks}
            searchTerm={filters.searchTerm}
            priorityFilter={filters.priorityFilter}
            categoryFilter={filters.categoryFilter}
            onSearchChange={term => setFilters(prev => ({ ...prev, searchTerm: term }))}
            onPriorityChange={priority => setFilters(prev => ({ ...prev, priorityFilter: priority }))}
            onCategoryChange={category => setFilters(prev => ({ ...prev, categoryFilter: category }))}
          />

          {/* Task list */}
          <TaskList
            tasks={filteredTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={id => setEditingTask(id)}
          />

          {/* Edit modal */}
          <TaskEditModal
            task={editingTaskData}
            onSave={handleEditTask}
            onClose={() => setEditingTask(null)}
            allTasks={tasks}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
