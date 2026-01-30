export type Priority = 'low' | 'medium' | 'high';
export type SortBy = 'date' | 'priority' | 'title';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority: Priority;
  category: string;
}

const TASKS_KEY = "tasks";
const THEME_KEY = "theme";

export function loadTasks(): Task[] {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading tasks", error);
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function addTask(title: string, priority: Priority = 'medium', category: string = 'General', dueDate?: string): Task {
  const tasks = loadTasks();
  const id = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  const task: Task = {
    id,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
    priority,
    category,
    dueDate,
  };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

export function updateTask(id: number, updates: Partial<Task>): Task | null {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  Object.assign(task, updates);
  saveTasks(tasks);
  return task;
}

export function deleteTask(id: number): void {
  const tasks = loadTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  saveTasks(filtered);
}

export function toggleTask(id: number): Task | null {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  task.completed = !task.completed;
  saveTasks(tasks);
  return task;
}

export function getStats(): { total: number; completed: number; pending: number; byPriority: Record<Priority, number> } {
  const tasks = loadTasks();
  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    byPriority: {
      low: tasks.filter((t) => t.priority === 'low' && !t.completed).length,
      medium: tasks.filter((t) => t.priority === 'medium' && !t.completed).length,
      high: tasks.filter((t) => t.priority === 'high' && !t.completed).length,
    },
  };
}

export function getCategories(): string[] {
  const tasks = loadTasks();
  return [...new Set(tasks.map((t) => t.category))];
}

export function setTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme);
}

export function getTheme(): 'light' | 'dark' {
  return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
}
