import { z } from 'zod';
import { normalizeTitle } from '@/shared/normalizeTitle.ts';
import { TITLE_ERRORS } from '@/shared-features/todos/TodosConfig.ts';

export const TodoDraftSchema = z.object({
  title: z.string().transform(normalizeTitle).pipe(z.string().min(1, TITLE_ERRORS[0]).max(200, TITLE_ERRORS[1])),
});
