import { definePlugin } from '@oxlint/plugins';
import { maxFunctions } from '#src/features/max-functions/maxFunctions.ts';
import { maxVariables } from '#src/features/max-variables/maxVariables.ts';

export default definePlugin({
  meta: { name: 'function-size' },
  rules: { 'max-variables': maxVariables, 'max-functions': maxFunctions },
});
