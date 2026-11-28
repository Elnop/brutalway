import { i18nextConfig } from '@brutalway/oxlint-config-i18next';
import { nextConfig } from '@brutalway/oxlint-config-next';
import { lineWidthConfig } from '@brutalway/oxlint-config-typescript/line-width';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [nextConfig, i18nextConfig, lineWidthConfig],
  ignorePatterns: ['.next', 'next-env.d.ts'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            regex: '^\\.\\.?/',
            message: 'No relative imports: use an alias (@/, @test-support/ or @test-e2e/).',
          },
        ],
      },
    ],
  },
  overrides: [{ files: ['*.config.ts'], rules: { 'no-restricted-imports': 'off' } }],
});
