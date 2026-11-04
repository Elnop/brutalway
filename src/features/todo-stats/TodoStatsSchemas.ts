import { z } from 'zod';

export const StatsSchema = z.object({ total: z.number().int(), completed: z.number().int(), remaining: z.number().int() });
