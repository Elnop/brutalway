import { i18nextConfig } from '@brutalway/oxlint-config-i18next';
import { reactViteConfig } from '@brutalway/oxlint-config-react-vite';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactViteConfig, i18nextConfig],
  ignorePatterns: ['dist'],
  overrides: [{ files: ['*.config.ts'], rules: { 'no-restricted-imports': 'off' } }],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            regex: '^\\.\\.?/',
            message:
              'Relative imports are not allowed: import through an alias (@/ in src/, @test-utils/ in test-utils/, @e2e/ in e2e/).',
          },
        ],
      },
    ],
  },
});
