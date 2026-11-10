import { definePlugin } from '@oxlint/plugins';
import { maxVariables } from '#src/features/max-variables/maxVariables.ts';

export default definePlugin({
  meta: { name: 'function-size' },
  rules: { 'max-variables': maxVariables },
});
