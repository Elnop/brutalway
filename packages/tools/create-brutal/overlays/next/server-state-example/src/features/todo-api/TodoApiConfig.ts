import type { ApiAnswer, StoredTodo } from '@/features/todo-api/TodoApiTypes.ts';

export const STARTER_TODOS: StoredTodo[] = [
  { id: 1, title: 'Read the README', completed: true },
  { id: 2, title: 'Run the checks', completed: false },
  { id: 3, title: 'Write your first feature', completed: false },
];

export const LIST_COOKIE = 'todo-list';

export const NOT_FOUND: ApiAnswer = { status: 404, body: { message: 'No todo has this id' } };

export const BLANK_TITLE: ApiAnswer = { status: 400, body: { message: 'The title is blank' } };
