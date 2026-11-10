import { reactViteConfig } from '@brutalway/oxlint-config-react-vite';
import { tanstackQueryConfig } from '@brutalway/oxlint-config-tanstack-query';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactViteConfig, tanstackQueryConfig],
  ignorePatterns: ['dist'],
  overrides: [{ files: ['*.config.ts'], rules: { 'no-restricted-imports': 'off' } }],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            regex: '^\\.\\.?/',
            message: 'Relative imports are not allowed: import through the @/ alias.',
          },
        ],
      },
    ],
  },
});
