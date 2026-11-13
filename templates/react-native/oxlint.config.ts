import { i18nextConfig } from '@brutalway/oxlint-config-i18next';
import { reactNativeConfig } from '@brutalway/oxlint-config-react-native';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactNativeConfig, i18nextConfig],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            regex: '^\\.\\.?/',
            message:
              'Relative imports are not allowed: import through an alias (@/ in src/, @test-utils/ in test-utils/).',
          },
        ],
      },
    ],
  },
  overrides: [
    { files: ['scripts/**'], env: { node: true } },
    { files: ['*.config.ts', 'scripts/**'], rules: { 'no-restricted-imports': 'off' } },
    {
      files: ['scripts/**'],
      rules: { 'no-console': 'off', 'fetch-placement/no-restricted-syntax': 'off' },
    },
  ],
});
