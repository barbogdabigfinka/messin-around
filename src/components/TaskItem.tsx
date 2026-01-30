import React from 'react';
import { Task, Priority } from '../types/index';
import { PRIORITY_CONFIG } from '../constants/config';
import '../styles/TaskItem.css';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

/**
 * TaskItem Component
 * Displays individual task with priority badge, category, due date, and action buttons
 * Includes visual indicators for overdue, today, and upcoming tasks
 */
export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  // Date comparison utilities
  const getDateOnly = (date: Date): Date => new Date(date.toDateString());
  const today = getDateOnly(new Date());
  const dueDate = task.dueDate ? getDateOnly(new Date(task.dueDate)) : null;

  const isOverdue = dueDate && dueDate < today && !task.completed;
  const isToday = dueDate && dueDate.getTime() === today.getTime();
  const isSoon =
    dueDate &&
    dueDate > today &&
    dueDate.getTime() - today.getTime() <= 24 * 60 * 60 * 1000 &&
    !isToday;

  const priorityConfig = PRIORITY_CONFIG[task.priority];

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} priority-${task.priority}`}>
      <button
        className="toggle-btn"
        onClick={() => onToggle(task.id)}
        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
        aria-label={task.completed ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`}
        aria-pressed={task.completed}
      >
        {task.completed ? '✓' : '○'}
      </button>

      <div className="task-content">
        <div className="task-main">
          <span className="task-title">{task.title}</span>
          <span className="task-category" title={`Category: ${task.category}`}>{task.category}</span>
          <span className="task-priority" style={{ borderColor: priorityConfig.color }} title={`Priority: ${priorityConfig.label}`}>
            {priorityConfig.label}
          </span>
        </div>

        {task.dueDate && (
          <div className={`task-duedate ${isOverdue ? 'overdue' : isToday ? 'today' : isSoon ? 'soon' : ''}`}>
            📅 {new Date(task.dueDate).toLocaleDateString()}
            {isOverdue && ' (Overdue)'}
            {isToday && ' (Today)'}
            {isSoon && ' (Soon)'}
          </div>
        )}
      </div>

      <div className="task-actions">
        <button 
          className="edit-btn" 
          onClick={() => onEdit(task.id)} 
          title="Edit task"
          aria-label={`Edit "${task.title}"`}
        >
          ✎
        </button>
        <button 
          className="delete-btn" 
          onClick={() => onDelete(task.id)} 
          title="Delete task"
          aria-label={`Delete "${task.title}"`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
