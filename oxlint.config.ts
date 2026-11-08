import { typescriptConfig } from '@brutalway/oxlint-config-typescript';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [typescriptConfig],
  plugins: ['typescript', 'import', 'oxc', 'unicorn', 'node'],
  env: { node: true, es2024: true },
  ignorePatterns: ['**/fixtures/**', '**/overlays/**', '**/dist/**', 'templates/**', 'site/**', 'packages/tools/check-doc-links/**'],
  overrides: [{ files: ['packages/tools/playwright-fixtures/**'], rules: { 'export-placement/no-restricted-syntax': 'off' } }],
});
