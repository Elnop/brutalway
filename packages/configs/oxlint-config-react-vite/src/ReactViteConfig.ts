import { reactConfig } from '@brutalway/oxlint-config-react';
import { vitestConfig } from '@brutalway/oxlint-config-vitest';
import { zustandConfig } from '@brutalway/oxlint-config-zustand';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

export const reactViteConfig: OxlintConfig = defineConfig({
  extends: [reactConfig, zustandConfig, vitestConfig],
  plugins: ['typescript', 'react', 'import', 'oxc', 'unicorn'],
  env: { browser: true, es2024: true },
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            regex: '^\\.\\.?/',
            message: 'Relative imports are not allowed: import through an alias.',
          },
        ],
      },
    ],
    'import/default': 'off',
    'import/no-unassigned-import': ['error', { allow: ['**/*.css'] }],
    'typescript/no-non-null-assertion': 'off',
    'unicorn/prefer-add-event-listener': 'off',
  },
  overrides: [{ files: ['e2e/**', '**/*.config.ts'], env: { node: true } }],
});
