# Task Manager - AI Coding Instructions

## Project Overview

**Task Manager Pro** is a React + TypeScript web app for managing daily tasks with priorities, categories, and due dates. All data persists to browser localStorage. Built with Vite for fast iteration and Vitest for testing.

## Architecture & Data Flow

### Three-Layer Service Architecture

1. **Components** (`src/components/`) - UI/presentation layer, zero business logic
   - Event handlers call hook functions from `useTasks` hook
   - Props flow down, callbacks flow up (standard React patterns)
   - Each component is isolated and reusable (e.g., `TaskItem.tsx` displays single task data)

2. **Custom Hooks** (`src/hooks/`) - State management & orchestration layer
   - `useTasks()` - CRUD operations on tasks, calls `TaskService`, manages loading/error state
   - `useFilteredTasks()` - Pure filtering/search logic (no side effects)
   - `useTaskStats()` - Computes statistics from task array
   - `useTheme()` - Theme preference persistence via `StorageService`

3. **Services** (`src/services/`) - Business logic & persistence layer
   - `TaskService` - Pure task operations (add, update, delete, toggle, validation)
   - `StorageService` - Generic localStorage wrapper with error handling
   - `ThemeService` - Theme state management
   - Services are **stateless classes** with static methods—no instances

### Data Flow Example

```
User clicks button in TaskItem.tsx
  → calls onDelete(taskId) prop
  → calls deleteTask(id) from useTasks hook
  → calls TaskService.deleteTask(id) 
  → calls StorageService.setItem() to persist
  → hook updates state, component re-renders
```

## Key Components & Patterns

### Error Handling

**Global Error Boundary** (`src/components/ErrorBoundary.tsx`)
- Catches React component errors and displays fallback UI
- Prevents entire application crash
- Shows error details in development mode
- Use by wrapping `<App />` with `<ErrorBoundary>`

**Component-level Validation**
- TaskForm validates input: non-empty titles, max 200 chars, future-only due dates
- TaskEditModal performs same validation on save
- Services return `null` on error with console warning
- Hooks catch service errors and set `error` state

### Recent Improvements (Production-Ready)
- ✅ Type safety: Replaced `Record<string, any>` with proper `TaskUpdate` type
- ✅ Hooks optimization: `useFilteredTasks` and `useTaskStats` now use `useMemo` for pure in-memory filtering
- ✅ Accessibility: Added ARIA labels, `role="alert"` for errors, keyboard navigation
- ✅ Input validation: Task titles checked for empty/length, due dates validated
- ✅ Error boundaries: Global error boundary prevents app crashes
- ✅ Date handling: Fixed date comparisons to avoid timezone issues
- ✅ Testing: Updated tests to match new accessibility patterns
- `Task` - Core interface: `id`, `title`, `completed`, `priority` (low/medium/high), `category`, `createdAt`, `dueDate?`
- `TaskFilters` - Search + priority + category filters
- `TaskStats` - Total/completed/pending counts + breakdown by priority

### Constants (`src/constants/config.ts`)
- **Storage keys** - versioned (`tasks_v1`, `theme_preference`) to handle migrations
- **Priority config** - emoji + hex color for each priority level
- **Default categories** - General, Work, Personal, Shopping, Health, Education
- **Messages** - UI strings for consistency

### Test Structure & Coverage
- **Test Framework**: Vitest (Jest-compatible syntax)
- **Test Environment**: happy-dom (lightweight DOM simulator)
- **Coverage Target**: 80% statements/functions, 70% branches
- **Test Organization**: Mirror source structure in `__tests__` folders
- **Setup**: `src/setupTests.ts` includes @testing-library/jest-dom

**Current Coverage** (22 tests):
- Services: ~92% (taskService, storageService, themeService)
- Hooks: ~82% (useTasks, useTheme, useFilteredTasks)
- Components: ~82% (TaskItem, TaskForm, TaskEditModal, etc.)
- ErrorBoundary: Added for crash prevention (now 44% baseline)

**Running Tests**:
```bash
npm test              # Run once
npm run test:watch   # Watch mode
npm run coverage     # Full coverage report
```

**TaskItem.tsx** - Shows task with status indicators:
- `isOverdue`, `isToday`, `isSoon` - computed locally using date math (`new Date()` comparisons)
- Priority badge rendered with PRIORITY_CONFIG color
- Three buttons: toggle (✓/○), edit (✎), delete (✕)

**TaskEditModal.tsx** - Edit form in modal:
- Receives `task` + `onSave` callback from parent (App.tsx)
- Validates empty titles before submission
- Resets form on successful save

**Stats.tsx** - Dashboard computed from `useTaskStats()`:
- Shows total, pending, completed, completion rate
- Displays pending tasks grouped by priority

## Developer Workflows

### Running the App
- **Dev (hot-reload)**: `npm run dev` → opens `http://localhost:3000` automatically
- **Build**: `npm run build` → runs TypeScript check, then Vite bundling
- **Production preview**: `npm run preview` → serves built files locally

### Testing
- **Run tests**: `vitest` or `npm test`
- **Watch mode**: `npm run test:watch`
- **Coverage**: `npm run coverage` → creates `coverage/` report (target: 80% statements/lines, 70% branches)
- **Test environment**: happy-dom (lightweight DOM simulator)
- **Setup**: `src/setupTests.ts` runs before all tests

### Test File Structure
- Mirrors src structure: `src/components/TaskItem.tsx` → `src/components/__tests__/TaskItem.test.tsx`
- Each service/hook has dedicated test file
- Avoid testing styles or CSS; exclude `*.css` and `src/styles/**` from coverage

## Project Conventions

### Error Handling
- **Services**: Return `null` on error, log to console, don't throw
- **Hooks**: Catch errors, set `error` state, return null for failed operations
- **Components**: Display error message if `error` state from hook is set
- **Storage**: Graceful fallback to default value if localStorage fails

### Type Safety
- Strict TypeScript enabled (`"strict": true`)
- Always type component props with interfaces
- Use discriminated unions (`Priority` type = `'low' | 'medium' | 'high'`)
- Avoid `any` type

### State Management
- **No Redux/Context API** - too simple for this project
- Hooks + ServiceClasses pattern is intentional
- `useTasks` is the single source of truth for task state in App.tsx
- Filters live in App.tsx state (`setFilters`), not global

### Component Design
- Functional components only (no class components)
- Props include callback functions, not state setters
- Each component has a JSDoc comment explaining its purpose
- CSS modules or scoped styles (class names prefixed with component name)

### Constants vs Magic Numbers
- All storage keys, themes, categories defined in `config.ts`
- Priority colors/labels in PRIORITY_CONFIG
- UI messages in MESSAGES constant
- **Exception**: Date math in TaskItem (isOverdue checks) is component-specific, OK to keep inline

## Adding Features

### Adding a New Task Property
1. Update `Task` interface in `src/types/index.ts`
2. Update `TaskService.addTask()` / `updateTask()` to handle the new field
3. Update `StorageService` versioning if breaking (e.g., `tasks_v1` → `tasks_v2`)
4. Add UI in `TaskForm.tsx` or `TaskEditModal.tsx`
5. Update `TaskItem.tsx` to display it (if needed)
6. Write tests for new validation logic in `src/services/__tests__/taskService.test.ts`
7. Add accessibility attributes (labels, descriptions) to new form fields

### Adding a New Filter
1. Add field to `TaskFilters` interface in `src/types/index.ts`
2. Add state in `App.tsx`: `const [filters, setFilters] = useState<TaskFilterType>(...)`
3. Implement filter logic in `useFilteredTasks()` hook using `useMemo`
4. Add UI control in `TaskFilters.tsx`
5. Test with `src/hooks/__tests__/useTasks.test.tsx`

### Adding a New Component
1. Create component in `src/components/MyComponent.tsx` with JSDoc comment
2. Define interface for props (strict typing, no `any`)
3. Add ARIA labels and semantic HTML
4. Add corresponding test file `src/components/__tests__/MyComponent.test.tsx`
5. Update `App.tsx` if it's a top-level component

### Adding a New Service
- Create file in `src/services/myService.ts` as stateless class with static methods
- Export class as default
- All public methods should be `static`
- Return `null` on errors, don't throw
- Wrap localStorage access with `StorageService` error handling
- Create tests in `src/services/__tests__/myService.test.ts` (target: >80% coverage)

## Production-Ready Enhancements

### Performance Optimization
1. **Memoization**: `useMemo` used in `useFilteredTasks` and `useTaskStats` to prevent unnecessary recalculations
2. **Pure Functions**: All filtering/calculation logic is pure (no side effects)
3. **In-Memory Operations**: Filtering happens in-memory, not via service calls
4. **Lazy State Updates**: Only update React state when data actually changes

### Accessibility (WCAG 2.1 AA)
1. **ARIA Labels**: All interactive elements have proper `aria-label` attributes
2. **Semantic HTML**: Proper use of `<button>`, `<form>`, `<label>` elements
3. **Error Messages**: Using `role="alert"` for dynamic errors
4. **Keyboard Navigation**: Full support via HTML form controls
5. **Dark Mode**: High contrast support in both light and dark themes

### Input Validation
- TaskForm & TaskEditModal validate:
  - Empty titles rejected
  - Max 200 character titles
  - Due dates cannot be in the past
- Visual error messages displayed with red background
- Form inputs show `maxLength={200}` for user feedback

## Critical Do's and Don'ts

✅ **DO:**
- Keep services stateless (static methods only)
- Always validate input in services (empty strings, null checks)
- Memoize computed values in components with `useMemo`
- Use semantic HTML (buttons for actions, not divs)
- Return null from services on error, don't throw
- Use proper TypeScript types (no `any`)
- Add ARIA labels to interactive elements
- Wrap component errors with ErrorBoundary
- Test new features before committing

❌ **DON'T:**
- Add business logic to components (move to service/hook)
- Use `any` type or ignore TypeScript strict mode
- Call `localStorage` directly (always use `StorageService`)
- Create new hooks for single-use state (keep in component)
- Mix component concerns (UI + formatting + data fetching)
- Forget to wrap state updates with `useMemo` when expensive
- Skip error handling in hooks/services
- Ignore accessibility requirements

## Key Dependencies

- **React 18**: UI framework
- **TypeScript 5.3**: Type safety
- **Vite 5**: Fast bundler with HMR
- **Vitest 1**: Testing framework (Vitest-compatible with Jest syntax)
- **@testing-library/react 14**: Component testing utilities
- **happy-dom**: Lightweight DOM for tests

## Build Artifacts

- `dist/` - Production bundle (generated by `npm run build`)
- `coverage/` - Test coverage report (generated by `npm run coverage`)
- Never commit these directories—they're regenerated on each build
