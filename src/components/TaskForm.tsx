import React, { useState } from 'react';
import { Priority } from '../types/index';
import { DEFAULT_CATEGORIES } from '../constants/config';
import '../styles/TaskForm.css';

interface TaskFormProps {
  onAdd: (title: string, priority: Priority, category: string, dueDate?: string) => void;
}

/**
 * TaskForm Component
 * Provides interface for creating new tasks with optional priority, category, and due date
 * Validates input before submission
 */
export default function TaskForm({ onAdd }: TaskFormProps) {
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedInput = input.trim();
    if (!trimmedInput) {
      setError('Task title cannot be empty');
      return;
    }

    if (trimmedInput.length > 200) {
      setError('Task title cannot exceed 200 characters');
      return;
    }

    if (dueDate && new Date(dueDate) < new Date(new Date().toDateString())) {
      setError('Due date cannot be in the past');
      return;
    }

    onAdd(trimmedInput, priority, category, dueDate || undefined);
    setInput('');
    setPriority('medium');
    setCategory('General');
    setDueDate('');
    setShowAdvanced(false);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-main">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="task-input"
          autoFocus
          maxLength={200}
          aria-label="Task title"
          aria-describedby={error ? 'form-error' : undefined}
        />
        <button type="submit" className="add-btn" aria-label="Add new task">
          Add Task
        </button>
        <button
          type="button"
          className={`toggle-advanced ${showAdvanced ? 'active' : ''}`}
          onClick={() => setShowAdvanced(!showAdvanced)}
          title="Show advanced options"
          aria-label="Toggle advanced options"
          aria-expanded={showAdvanced}
        >
          ⚙️
        </button>
      </div>

      {error && (
        <div id="form-error" className="form-error" role="alert">
          ⚠️ {error}
        </div>
      )}

      {showAdvanced && (
        <div className="form-advanced">
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
