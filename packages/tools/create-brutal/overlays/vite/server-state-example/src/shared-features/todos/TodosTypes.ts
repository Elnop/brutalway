import type { z } from 'zod';
import type { TodoFilterSchema, TodoSchema } from '@/shared-features/todos/TodosSchemas.ts';

export type Todo = z.infer<typeof TodoSchema>;

export type TodoFilter = z.infer<typeof TodoFilterSchema>;

type TodoPatch = {
  title?: string;
  completed?: boolean;
};

export type TodoUpdate = {
  id: Todo['id'];
  patch: TodoPatch;
};

export type TodosState = {
  filter: TodoFilter;
};

export type TodosActions = {
  setFilter: (filter: TodoFilter) => void;
};
