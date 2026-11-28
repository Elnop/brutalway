import { i18nextConfig } from '@brutalway/oxlint-config-i18next';
import { reactViteConfig } from '@brutalway/oxlint-config-react-vite';
import { lineWidthConfig } from '@brutalway/oxlint-config-typescript/line-width';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactViteConfig, i18nextConfig, lineWidthConfig],
  ignorePatterns: ['dist'],
  overrides: [{ files: ['*.config.ts'], rules: { 'no-restricted-imports': 'off' } }],
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
});
