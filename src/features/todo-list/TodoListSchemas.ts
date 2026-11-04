import { z } from 'zod';

export const TodoIdParamsSchema = z.object({ id: z.coerce.number().int().positive() });

export const ClearedSchema = z.object({ deleted: z.number().int().min(0) });
