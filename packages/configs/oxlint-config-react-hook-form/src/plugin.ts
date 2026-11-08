import { definePlugin } from '@oxlint/plugins';
import { validationInSchema } from '#src/features/validation-in-schema/validationInSchema.ts';
import { zodResolver } from '#src/features/zod-resolver/zodResolver.ts';

export default definePlugin({
  meta: { name: 'form-conventions' },
  rules: { 'zod-resolver': zodResolver, 'validation-in-schema': validationInSchema },
});
