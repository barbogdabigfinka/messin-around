import TaskService from '../taskService';

describe('TaskService', () => {
  beforeEach(() => {
    TaskService.clearAllTasks();
  });

  test('addTask should reject empty title', () => {
    const t = TaskService.addTask('   ');
    expect(t).toBeNull();
  });

  test('addTask creates a task and getAllTasks returns it', () => {
    const a = TaskService.addTask('Task A', 'high', 'Work');
    expect(a).not.toBeNull();
    const all = TaskService.getAllTasks();
    expect(all.length).toBe(1);
    expect(all[0].title).toBe('Task A');
  });

  test('toggleTask flips completion', () => {
    const t = TaskService.addTask('Toggle', 'medium', 'General');
    expect(t).not.toBeNull();
    const toggled = TaskService.toggleTask(t!.id);
    expect(toggled).not.toBeNull();
    expect(toggled!.completed).toBe(true);
  });

  test('updateTask updates fields', () => {
    const t = TaskService.addTask('ToUpdate', 'low', 'Personal');
    const updated = TaskService.updateTask(t!.id, { title: 'Updated', priority: 'high' });
    expect(updated).not.toBeNull();
    expect(updated!.title).toBe('Updated');
    expect(updated!.priority).toBe('high');
  });

  test('deleteTask removes task', () => {
    const t = TaskService.addTask('ToDelete');
    expect(TaskService.deleteTask(t!.id)).toBe(true);
    expect(TaskService.getAllTasks().length).toBe(0);
  });

  test('getFilteredTasks filters correctly', () => {
    TaskService.clearAllTasks();
    TaskService.addTask('Buy milk', 'low', 'Shopping');
    TaskService.addTask('Finish report', 'high', 'Work');
    TaskService.addTask('Call mom', 'medium', 'Personal');

    const bySearch = TaskService.getFilteredTasks('buy');
    expect(bySearch.length).toBe(1);

    const byPriority = TaskService.getFilteredTasks('', 'high');
    expect(byPriority.length).toBe(1);

    const byCategory = TaskService.getFilteredTasks('', 'all', 'Personal');
    expect(byCategory.length).toBe(1);
  });

  test('getStats returns correct numbers', () => {
    TaskService.clearAllTasks();
    TaskService.addTask('A');
    TaskService.addTask('B');
    const t = TaskService.addTask('C');
    TaskService.toggleTask(t!.id);

    const stats = TaskService.getStats();
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(2);
  });
});
