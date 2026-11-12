import { i18nextConfig } from '@brutalway/oxlint-config-i18next';
import { nextConfig } from '@brutalway/oxlint-config-next';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [nextConfig, i18nextConfig],
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
  },
  overrides: [{ files: ['*.config.ts'], rules: { 'no-restricted-imports': 'off' } }],
});
