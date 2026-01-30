# Task Manager Pro

A production-ready, feature-rich web-based task manager built with React, TypeScript, and Vite. Manage your daily tasks with priorities, categories, due dates, and more. Fully tested, type-safe, and designed for scalability.

## ✨ Features

- 📝 **Create tasks** with titles, priorities (low/medium/high), and categories
- 🗓️ **Due dates** - set deadlines and get visual indicators for overdue/today/soon tasks
- 🎯 **Priority levels** - organize tasks by importance with color-coded indicators
- 📂 **Categories** - organize tasks by Work, Personal, Shopping, Health, Education, and more
- 🔍 **Search & Filter** - quickly find tasks by name, priority, or category
- 📊 **Statistics dashboard** - view completion rate, pending tasks, and priority breakdown
- 🌙 **Dark mode** - toggle between light and dark themes (preference saved)
- ✏️ **Edit tasks** - modify any task's details without deleting
- 💾 **Persistent storage** - all data saved to browser localStorage
- ⚡ **Fast & responsive** - built with Vite for instant hot-reload in development
- 📱 **Mobile-friendly** - works perfectly on desktop, tablet, and mobile
- ♿ **Accessible** - WCAG-compliant with full ARIA support
- 🛡️ **Error Handling** - Graceful error boundary and input validation
- ✅ **Comprehensive Testing** - 22 tests covering core functionality

## ✨ Features

- 📝 **Create tasks** with titles, priorities (low/medium/high), and categories
- 🗓️ **Due dates** - set deadlines and get visual indicators for overdue/today/soon tasks
- 🎯 **Priority levels** - organize tasks by importance with color-coded indicators
- 📂 **Categories** - organize tasks by Work, Personal, Shopping, Health, Education, and more
- 🔍 **Search & Filter** - quickly find tasks by name, priority, or category
- 📊 **Statistics dashboard** - view completion rate, pending tasks, and priority breakdown
- 🌙 **Dark mode** - toggle between light and dark themes (preference saved)
- ✏️ **Edit tasks** - modify any task's details without deleting
- 💾 **Persistent storage** - all data saved to browser localStorage
- ⚡ **Fast & responsive** - built with Vite for instant hot-reload in development
- 📱 **Mobile-friendly** - works perfectly on desktop, tablet, and mobile

## Installation & Setup

Clone and install dependencies:

```bash
git clone <repo-url>
cd task-manager
npm install
```

## Running the App

### Development Mode (Recommended)

```bash
npm run dev
```

This starts the development server on `http://localhost:3000` with hot-reload enabled. Changes to the code are reflected instantly.

### Production Build

```bash
npm run build
npm run preview
```

### Testing

Run the full test suite:

```bash
# Run tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Coverage report (target: 80% statements/functions, 70% branches)
npm run coverage
```

## How to Use

### Adding Tasks

1. **Simple Add**: Type in the input field and click "Add Task" or press Enter
2. **Advanced Add**: Click the ⚙️ button to reveal:
   - **Priority**: Choose Low 🟢, Medium 🟡, or High 🔴
   - **Category**: Select from Work, Personal, Shopping, Health, Education, General
   - **Due Date**: Set a deadline (optional)

### Managing Tasks

- **Complete**: Click the circle button to mark tasks complete/incomplete
- **Edit**: Click the ✎ button to modify task details
- **Delete**: Hover over a task and click ✕ to remove it

### Filtering & Searching

- **Search**: Type in the search field to filter tasks by title
- **Priority Filter**: Show only tasks of a specific priority level
- **Category Filter**: Show only tasks from a specific category

### Dashboard

The statistics panel shows:
- **Total Tasks**: All tasks in your list
- **Pending**: Tasks that need to be completed
- **Completed**: Finished tasks
- **Completion Rate**: Percentage of completed tasks
- **Priority Breakdown**: Count of pending tasks by priority

### Dark Mode

Click the sun/moon icon (☀️/🌙) in the header to toggle dark mode. Your preference is automatically saved.

## Task Status Indicators

- **🟢 Overdue**: Due date is in the past (shows for incomplete tasks)
- **🟡 Today**: Due date is today
- **🔴 Soon**: Due date is within 24 hours
- **📅 Regular date**: Future due dates

## Project Structure

```
src/
├── components/
│   ├── ErrorBoundary.tsx       # Global error handling component
│   ├── App.tsx                 # Main app orchestrator
│   ├── TaskForm.tsx            # Task creation with validation
│   ├── TaskList.tsx            # Task container
│   ├── TaskItem.tsx            # Individual task display
│   ├── TaskFilters.tsx         # Search and filtering UI
│   ├── TaskEditModal.tsx       # Edit dialog with validation
│   ├── Stats.tsx               # Statistics dashboard
│   └── __tests__/              # Component tests
├── hooks/
│   ├── useTasks.ts             # Task state management
│   ├── useTheme.ts             # Theme preference management
│   └── __tests__/              # Hook tests
├── services/
│   ├── taskService.ts          # Task business logic
│   ├── storageService.ts       # localStorage abstraction
│   ├── themeService.ts         # Theme persistence
│   └── __tests__/              # Service tests
├── types/
│   └── index.ts                # TypeScript type definitions
├── constants/
│   └── config.ts               # App configuration & constants
├── styles/
│   ├── index.css               # Global styles
│   ├── App.css                 # Layout & theme
│   ├── TaskForm.css            # Form styles
│   ├── TaskFilters.css         # Filter UI
│   ├── TaskItem.css            # Task display
│   ├── TaskList.css            # List container
│   ├── TaskEditModal.css       # Modal dialog
│   └── Stats.css               # Statistics cards
├── main.tsx                    # React entry point
├── App.tsx                     # Root component
└── setupTests.ts               # Test configuration
```

## Technologies

- **React 18** - Modern UI framework with hooks
- **TypeScript 5.3** - Strict type checking for reliability
- **Vite 5** - Lightning-fast build tool with HMR
- **Vitest 1** - Fast unit testing framework
- **@testing-library/react** - Component testing utilities
- **CSS3** - Modern styling with CSS variables and animations

## Code Quality & Best Practices

### Architecture
- **Three-layer service architecture**: Components → Hooks → Services
- **Pure functions**: Services are stateless with static methods
- **Type safety**: Strict TypeScript enabled, no `any` types
- **Error handling**: Graceful fallbacks with error boundaries

### Testing
- **22 unit tests** covering core functionality
- **Target coverage**: 80% statements/functions, 70% branches
- **Test organization**: Mirrors source structure (`src/` → `src/__tests__/`)
- **Happy-dom environment**: Lightweight, fast test execution

### Performance
- **Memoization**: `useMemo` for expensive computations
- **In-memory filtering**: No redundant service calls
- **Code splitting**: Vite automatic optimization
- **Bundle size**: ~50KB gzipped (optimized build)

## Browser Support

Works in all modern browsers:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Data Storage

All task data is stored in your browser's **localStorage**:
- No server required
- Data persists across sessions
- Private to your device
- Survives browser refreshes

Each task contains:
- **id**: Unique identifier
- **title**: Task description
- **completed**: Completion status
- **priority**: Low, Medium, or High
- **category**: Task category
- **dueDate**: Optional deadline (ISO format)
- **createdAt**: Creation timestamp

## Tips & Tricks

1. **Bulk Workflow**: Add multiple tasks quickly by using the simple input without opening advanced options
2. **Priority Management**: Use the priority filter to focus on high-priority tasks first
3. **Category Organization**: Group related tasks by category to stay organized
4. **Due Dates**: Set dates to create a sense of urgency and track deadlines
5. **Dark Mode**: Use dark mode in the evening to reduce eye strain
6. **Completion Tracking**: Watch your completion percentage increase as you finish tasks

## Accessibility

This application meets WCAG 2.1 AA standards:
- ♿ Full keyboard navigation support
- 🎤 Semantic HTML with proper ARIA labels
- 🎨 High contrast dark and light modes
- 📱 Responsive design for all screen sizes
- 🔊 Clear error messages with `role="alert"`
- 🎯 Proper focus management in modals

## Customization

To customize categories, edit the `DEFAULT_CATEGORIES` array in `src/constants/config.ts`:

```typescript
export const DEFAULT_CATEGORIES = [
  'General',
  'Work',
  'Personal',
  'Shopping',
  'Health',
  'Education',
] as const;
```

To change the color scheme, modify the CSS variables in `src/styles/index.css`:

```css
:root {
  --primary: #667eea;
  --primary-dark: #764ba2;
  --success: #10b981;
  /* ... more variables */
}
```

## Future Enhancements

Planned features for future versions:
- Recurring/recurring tasks
- Task descriptions/notes
- Subtasks support
- Tag system
- Undo/redo functionality
- Cloud sync & collaboration
- Export to CSV/PDF
- Calendar/timeline view
- Notifications/reminders
- Performance monitoring

## Contributing

To contribute improvements:

1. Ensure tests pass: `npm run test:watch`
2. Maintain TypeScript strictness: `npm run build`
3. Check coverage: `npm run coverage` (target: >80%)
4. Follow existing code patterns from `.github/copilot-instructions.md`
5. Add tests for new features
6. Update README if adding user-facing changes

## License

MIT
