import { nodeTestConfig } from '@brutalway/oxlint-config-node-test';
import { defineConfig } from 'oxlint';
import { typescriptConfig } from '#src/TypescriptConfig.ts';

export default defineConfig({
  extends: [typescriptConfig, nodeTestConfig],
  plugins: ['typescript', 'import', 'oxc', 'unicorn', 'node'],
  env: { node: true, es2024: true },
  rules: {
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
});
