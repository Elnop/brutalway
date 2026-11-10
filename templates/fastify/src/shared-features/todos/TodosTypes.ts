import type { z } from 'zod';
import type {
  TodoDraftSchema,
  TodoFilterSchema,
  TodoPatchSchema,
  TodoSchema,
} from '#src/shared-features/todos/TodosSchemas.ts';

export type Todo = z.infer<typeof TodoSchema>;

export type TodoDraft = z.infer<typeof TodoDraftSchema>;

export type TodoPatch = z.infer<typeof TodoPatchSchema>;

export type TodoFilter = z.infer<typeof TodoFilterSchema>;

export type TodosQueries = {
  list: () => Todo[];
  listByCompleted: (completed: boolean) => Todo[];
  find: (id: number) => Todo | null;
  insert: (draft: TodoDraft) => Todo;
  update: (id: number, patch: TodoPatch) => Todo | null;
  remove: (id: number) => Todo | null;
  removeCompleted: () => number;
  count: () => { total: number; completed: number };
};
