import type { Todo } from '@/shared-features/todos/TodosTypes.ts';

export const STARTER_TODOS: Todo[] = [
  { id: 'read-the-readme', title: 'Read the README', completed: true },
  { id: 'run-the-checks', title: 'Run npm run check', completed: false },
  { id: 'write-a-feature', title: 'Write your first feature', completed: false },
];

export const TODO_FILTERS = ['all', 'active', 'completed'] as const;
