import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

export const tanstackQueryConfig: OxlintConfig = defineConfig({
  jsPlugins: [
    { name: 'query-conventions', specifier: fileURLToPath(new URL('./plugin.js', import.meta.url)) },
    { name: 'tanstack-query', specifier: fileURLToPath(import.meta.resolve('@tanstack/eslint-plugin-query')) },
  ],
  rules: {
    'query-conventions/query-key-factory': 'error',
    'query-conventions/named-cache-windows': 'error',
    'tanstack-query/exhaustive-deps': 'error',
    'tanstack-query/stable-query-client': 'error',
  },
  overrides: [
    { files: ['**/*Keys.ts'], rules: { 'query-conventions/query-key-factory': 'off' } },
    { files: ['**/*QueryConfig.ts'], rules: { 'query-conventions/named-cache-windows': 'off' } },
  ],
});
