import { typescriptConfig } from '@brutalway/oxlint-config-typescript';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

export const nodeConfig: OxlintConfig = defineConfig({
  extends: [typescriptConfig],
  plugins: ['typescript', 'import', 'oxc', 'unicorn', 'node'],
  env: { node: true, es2024: true },
  rules: {
    'no-restricted-globals': [
      'error',
      {
        name: 'fetch',
        message:
          'Only an xClient.ts file calls fetch: move this call into the client of the API it targets.',
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            regex: '^\\.\\.?/',
            message:
              'Relative imports are not allowed: import through the #src/ alias declared in package.json "imports".',
          },
        ],
      },
    ],
  },
  overrides: [
    { files: ['**/*Client.ts', '**/*.test.ts'], rules: { 'no-restricted-globals': 'off' } },
    {
      files: ['**/*Client.ts'],
      rules: { 'file-named-after-export/file-named-after-export': 'off' },
    },
  ],
});
