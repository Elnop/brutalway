import { z } from 'zod';
import { normalizeTitle } from '@/shared/lib/normalizeTitle.ts';

export const TodoDraftSchema = z.object({
  title: z.string().transform(normalizeTitle).pipe(z.string().min(1, 'The title is blank').max(200, 'The title is 200 characters at most')),
});
