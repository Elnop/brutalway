import { z } from 'zod';
import { TODO_FILTERS } from '@/shared/todos/TodosConfig.ts';

export const TodoSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  completed: z.boolean(),
});

export const TodoListSchema = z.array(TodoSchema);

export const TodoFilterSchema = z.enum(TODO_FILTERS);

export const TodoStatsSchema = z.object({
  total: z.number().int(),
  completed: z.number().int(),
  remaining: z.number().int(),
});

export const ClearedSchema = z.object({ deleted: z.number().int().min(0) });
