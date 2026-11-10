import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

export const shadcnConfig: OxlintConfig = defineConfig({
  jsPlugins: [
    { name: 'ui-conventions', specifier: fileURLToPath(new URL('./plugin.js', import.meta.url)) },
  ],
  rules: {
    'ui-conventions/primitives-first': 'error',
    'ui-conventions/one-icon-library': 'error',
  },
});
