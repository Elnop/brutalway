import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

export const reactHookFormConfig: OxlintConfig = defineConfig({
  jsPlugins: [
    { name: 'form-conventions', specifier: fileURLToPath(new URL('./plugin.js', import.meta.url)) },
  ],
  rules: {
    'form-conventions/zod-resolver': 'error',
    'form-conventions/validation-in-schema': 'error',
  },
});
