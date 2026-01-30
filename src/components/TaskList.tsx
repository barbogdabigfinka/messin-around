import React from 'react';
import { Task } from '../types/index';
import TaskItem from './TaskItem';
import '../styles/TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

/**
 * TaskList Component
 * Renders list of tasks or empty state if no tasks exist
 */
export default function TaskList({ tasks, onToggle, onDelete, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>📋 No tasks found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
