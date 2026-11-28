import { i18nextConfig } from '@brutalway/oxlint-config-i18next';
import { reactNativeConfig } from '@brutalway/oxlint-config-react-native';
import { lineWidthConfig } from '@brutalway/oxlint-config-typescript/line-width';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactNativeConfig, i18nextConfig, lineWidthConfig],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            regex: '^\\.\\.?/',
            message: 'No relative imports: use an alias (@/ or @test-support/).',
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
