import { i18nextConfig } from '@brutalway/oxlint-config-i18next';
import { reactConfig } from '@brutalway/oxlint-config-react';
import { vitestConfig } from '@brutalway/oxlint-config-vitest';
import { zustandConfig } from '@brutalway/oxlint-config-zustand';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactConfig, zustandConfig, vitestConfig, i18nextConfig],
  plugins: ['typescript', 'react', 'import', 'oxc', 'unicorn', 'nextjs'],
  env: { browser: true, es2024: true },
  ignorePatterns: ['.next', 'next-env.d.ts'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            regex: '^\\.\\.?/',
            message:
              'Relative imports are not allowed: import through an alias (@/ in src/, @e2e/ in e2e/).',
          },
        ],
      },
    ],
    'import/default': 'off',
    'import/no-unassigned-import': ['error', { allow: ['**/*.css'] }],
    'typescript/no-non-null-assertion': 'off',
    'unicorn/prefer-add-event-listener': 'off',
  },
  overrides: [
    { files: ['e2e/**', '*.config.ts', 'src/proxy.ts'], env: { node: true } },
    { files: ['*.config.ts'], rules: { 'no-restricted-imports': 'off' } },
    {
      files: ['src/app/**/{page,layout,loading,error}.tsx'],
      rules: {
        'import/no-default-export': 'off',
        'file-named-after-export/file-named-after-export': 'off',
        'react/only-export-components': [
          'error',
          { allowExportNames: ['generateMetadata', 'generateViewport'] },
        ],
      },
    },
  ],
});
