import { z } from 'zod';

export const TodoIdParamsSchema = z.object({ id: z.coerce.number().int().positive() });

export const ErrorSchema = z.object({ message: z.string() });

export const ClearedSchema = z.object({ deleted: z.number().int().min(0) });
