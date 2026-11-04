import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  completed: z.boolean(),
});

const TODO_TITLE = z
  .string()
  .transform((title) => title.trim().replaceAll(/\s+/gu, ' '))
  .pipe(z.string().min(1, 'The title is blank').max(200));

export const TodoDraftSchema = z.object({ title: TODO_TITLE });

export const TodoPatchSchema = z.object({ title: TODO_TITLE.optional(), completed: z.boolean().optional() }).refine((patch) => patch.title !== undefined || patch.completed !== undefined, {
  message: 'Send a title, completed, or both',
});

export const TodoFilterSchema = z.enum(['all', 'active', 'completed']);
