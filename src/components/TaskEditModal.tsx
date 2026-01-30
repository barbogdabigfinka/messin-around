import React, { useState } from 'react';
import { Task, Priority, TaskUpdate } from '../types/index';
import { DEFAULT_CATEGORIES } from '../constants/config';
import TaskTagsPanel from './TaskTagsPanel';
import SubtaskList from './SubtaskList';
import TaskNotesPanel from './TaskNotesPanel';
import { useTags } from '../hooks/useTags';
import { useSubtasks } from '../hooks/useSubtasks';
import { useTaskNotes } from '../hooks/useTaskNotes';
import TaskService from '../services/taskService';
import '../styles/TaskEditModal.css';

interface TaskEditModalProps {
  task: Task | null;
  onSave: (updates: TaskUpdate) => void;
  onClose: () => void;
  allTasks?: Task[];
}

/**
 * TaskEditModal Component
 * Modal dialog for editing an existing task with full feature support
 */

export default function TaskEditModal({ task, onSave, onClose, allTasks = [] }: TaskEditModalProps) {
  if (!task) return null;

  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [category, setCategory] = useState(task.category);
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'tags' | 'subtasks' | 'notes'>('basic');

  // Use hooks for tag, subtask, and notes management
  const { tags: allTags } = useTags(allTasks);
  const { subtasks, addSubtask, toggleSubtask, deleteSubtask, updateSubtaskTitle } = useSubtasks(task.id, task);
  const { saveNotes } = useTaskNotes(task.id, task.notes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Task title cannot be empty');
      return;
    }

    if (trimmedTitle.length > 200) {
      setError('Task title cannot exceed 200 characters');
      return;
    }

    if (dueDate && new Date(dueDate) < new Date(new Date().toDateString())) {
      setError('Due date cannot be in the past');
      return;
    }

    onSave({
      title: trimmedTitle,
      priority,
      category,
      dueDate: dueDate || undefined,
    });
    
    setSuccess('Changes saved successfully!');
    setTimeout(() => setSuccess(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 id="modal-title">Edit Task</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close dialog">✕</button>
        </div>

        {/* Tab Navigation */}
        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
            aria-selected={activeTab === 'basic'}
          >
            Basic Info
          </button>
          <button
            className={`tab-btn ${activeTab === 'tags' ? 'active' : ''}`}
            onClick={() => setActiveTab('tags')}
            aria-selected={activeTab === 'tags'}
          >
            Tags
          </button>
          <button
            className={`tab-btn ${activeTab === 'subtasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('subtasks')}
            aria-selected={activeTab === 'subtasks'}
          >
            Checklist
          </button>
          <button
            className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
            aria-selected={activeTab === 'notes'}
          >
            Notes
          </button>
        </div>

        {error && (
          <div className="form-error" role="alert">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="form-success" role="status">
            ✓ {success}
          </div>
        )}

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="edit-title">Title</label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                required
                autoFocus
                maxLength={200}
                aria-describedby={error ? 'modal-error' : undefined}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-priority">Priority</label>
                <select id="edit-priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-category">Category</label>
                <select id="edit-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-duedate">Due Date</label>
              <input
                id="edit-duedate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-save">
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Tags Tab */}
        {activeTab === 'tags' && (
          <div className="modal-section">
            <TaskTagsPanel
              tags={task.tags || []}
              availableTags={allTags}
              onTagsChange={(newTags) => {
                onSave({ tags: newTags });
                setSuccess('Tags saved!');
                setTimeout(() => setSuccess(null), 1500);
              }}
            />
          </div>
        )}

        {/* Subtasks Tab */}
        {activeTab === 'subtasks' && (
          <div className="modal-section">
            <SubtaskList
              subtasks={subtasks}
              onToggleSubtask={(subtaskId) => {
                toggleSubtask(subtaskId);
                // Fetch updated task and notify parent
                setTimeout(() => {
                  const updated = TaskService.getTaskById(task.id);
                  if (updated?.subtasks) {
                    onSave({ subtasks: updated.subtasks });
                    setSuccess('Subtask updated!');
                    setTimeout(() => setSuccess(null), 1500);
                  }
                }, 0);
              }}
              onDeleteSubtask={(subtaskId) => {
                deleteSubtask(subtaskId);
                // Fetch updated task and notify parent
                setTimeout(() => {
                  const updated = TaskService.getTaskById(task.id);
                  if (updated?.subtasks) {
                    onSave({ subtasks: updated.subtasks });
                    setSuccess('Subtask deleted!');
                    setTimeout(() => setSuccess(null), 1500);
                  }
                }, 0);
              }}
              onAddSubtask={(title) => {
                addSubtask(title);
                // Fetch updated task and notify parent
                setTimeout(() => {
                  const updated = TaskService.getTaskById(task.id);
                  if (updated?.subtasks) {
                    onSave({ subtasks: updated.subtasks });
                    setSuccess('Subtask added!');
                    setTimeout(() => setSuccess(null), 1500);
                  }
                }, 0);
              }}
              onUpdateSubtaskTitle={(subtaskId, newTitle) => {
                updateSubtaskTitle(subtaskId, newTitle);
                // Fetch updated task and notify parent
                setTimeout(() => {
                  const updated = TaskService.getTaskById(task.id);
                  if (updated?.subtasks) {
                    onSave({ subtasks: updated.subtasks });
                    setSuccess('Subtask updated!');
                    setTimeout(() => setSuccess(null), 1500);
                  }
                }, 0);
              }}
            />
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="modal-section">
            <TaskNotesPanel
              initialNotes={task.notes || ''}
              onSaveNotes={(notes) => {
                saveNotes(notes);
                // Notify parent of change
                setTimeout(() => {
                  onSave({ notes });
                  setSuccess('Notes saved!');
                  setTimeout(() => setSuccess(null), 1500);
                }, 0);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
