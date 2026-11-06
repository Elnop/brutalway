import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

export const vitestConfig: OxlintConfig = defineConfig({
  plugins: ['vitest'],
  rules: {
    'vitest/consistent-test-it': ['error', { fn: 'test', withinDescribe: 'it' }],
    'vitest/valid-expect': ['error', { maxArgs: 2 }],
    'vitest/require-mock-type-parameters': 'error',
    'vitest/require-to-throw-message': 'error',
    'vitest/prefer-strict-equal': 'error',
    'vitest/prefer-to-be': 'error',
    'vitest/prefer-strict-boolean-matchers': 'error',
    'vitest/prefer-called-times': 'error',
  },
});
