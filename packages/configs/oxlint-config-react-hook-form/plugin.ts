import { definePlugin } from '@oxlint/plugins';
import { validationInSchema } from './validationInSchema.ts';
import { zodResolver } from './zodResolver.ts';

export default definePlugin({
  meta: { name: 'form-conventions' },
  rules: { 'zod-resolver': zodResolver, 'validation-in-schema': validationInSchema },
});
