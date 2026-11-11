import { i18nextConfig } from '@brutalway/oxlint-config-i18next';
import { reactConfig } from '@brutalway/oxlint-config-react';
import { zustandConfig } from '@brutalway/oxlint-config-zustand';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactConfig, zustandConfig, i18nextConfig],
  plugins: ['typescript', 'react', 'import', 'oxc', 'unicorn', 'jest'],
  env: { browser: true, es2024: true },
  ignorePatterns: ['.expo', 'dist', 'expo-env.d.ts'],
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
    'import/default': 'off',
    'typescript/no-non-null-assertion': 'off',
    'jest/consistent-test-it': ['error', { fn: 'test', withinDescribe: 'it' }],
    'jest/valid-expect': ['error', { maxArgs: 2 }],
    'jest/require-to-throw-message': 'error',
    'jest/prefer-strict-equal': 'error',
    'jest/prefer-to-be': 'error',
  },
  overrides: [
    { files: ['*.config.ts', 'jest.setup.ts', 'scripts/**'], env: { node: true } },
    { files: ['*.config.ts', 'scripts/**'], rules: { 'no-restricted-imports': 'off' } },
    {
      files: ['scripts/**'],
      rules: { 'no-console': 'off', 'fetch-placement/no-restricted-syntax': 'off' },
    },
    {
      files: ['src/app/screens/**/*.tsx'],
      rules: {
        'import/no-default-export': 'off',
        'file-named-after-export/file-named-after-export': 'off',
        'react/only-export-components': 'off',
        'check-file/no-index': 'off',
      },
    },
  ],
});
