/**
 * SubtaskList component
 * Displays and manages subtasks for a task
 */

import React, { useState } from 'react';
import { Subtask } from '../types/index';
import '../styles/SubtaskList.css';

interface SubtaskListProps {
  /** List of subtasks */
  subtasks: Subtask[];
  /** Callback when subtask is toggled */
  onToggleSubtask: (subtaskId: string) => void;
  /** Callback when subtask is deleted */
  onDeleteSubtask: (subtaskId: string) => void;
  /** Callback when new subtask is added */
  onAddSubtask: (title: string) => void;
  /** Callback when subtask title is updated */
  onUpdateSubtaskTitle?: (subtaskId: string, newTitle: string) => void;
}

/**
 * Component for managing task subtasks/checklists
 */
export default function SubtaskList({
  subtasks,
  onToggleSubtask,
  onDeleteSubtask,
  onAddSubtask,
  onUpdateSubtaskTitle,
}: SubtaskListProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      onAddSubtask(newSubtaskTitle);
      setNewSubtaskTitle('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubtask();
    }
  };

  const handleSaveEdit = (subtaskId: string) => {
    if (editingTitle.trim() && onUpdateSubtaskTitle) {
      onUpdateSubtaskTitle(subtaskId, editingTitle);
      setEditingId(null);
    }
  };

  const completedCount = subtasks.filter(st => st.completed).length;
  const progressPercent =
    subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

  return (
    <div className="subtask-list">
      <div className="subtask-header">
        <h4 className="subtask-title">
          Checklist ({completedCount}/{subtasks.length})
        </h4>
        {subtasks.length > 0 && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={completedCount}
              aria-valuemin={0}
              aria-valuemax={subtasks.length}
            />
          </div>
        )}
      </div>

      {/* Subtask list */}
      {subtasks.length === 0 ? (
        <p className="no-subtasks">No subtasks yet. Add one below!</p>
      ) : (
        <ul className="subtask-items">
          {subtasks.map(subtask => (
            <li key={subtask.id} className="subtask-item">
              <div className="subtask-content">
                <input
                  type="checkbox"
                  className="subtask-checkbox"
                  checked={subtask.completed}
                  onChange={() => onToggleSubtask(subtask.id)}
                  aria-label={`Toggle ${subtask.title}`}
                />
                {editingId === subtask.id ? (
                  <input
                    type="text"
                    className="subtask-edit-input"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onBlur={() => handleSaveEdit(subtask.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveEdit(subtask.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    className={`subtask-label ${
                      subtask.completed ? 'completed' : ''
                    }`}
                    onClick={() => {
                      setEditingId(subtask.id);
                      setEditingTitle(subtask.title);
                    }}
                  >
                    {subtask.title}
                  </span>
                )}
              </div>
              <button
                className="subtask-delete"
                onClick={() => onDeleteSubtask(subtask.id)}
                aria-label={`Delete ${subtask.title}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add subtask input */}
      <div className="add-subtask-wrapper">
        <input
          type="text"
          className="add-subtask-input"
          placeholder="Add a subtask..."
          value={newSubtaskTitle}
          onChange={e => setNewSubtaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="add-subtask-btn"
          onClick={handleAddSubtask}
          aria-label="Add subtask"
        >
          +
        </button>
      </div>
    </div>
  );
}
