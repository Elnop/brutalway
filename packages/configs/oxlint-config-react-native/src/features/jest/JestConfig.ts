import type { DummyRuleMap } from 'oxlint';

export const jestRules: DummyRuleMap = {
  'jest/consistent-test-it': ['error', { fn: 'test', withinDescribe: 'it' }],
  'jest/valid-expect': ['error', { maxArgs: 2 }],
  'jest/require-to-throw-message': 'error',
  'jest/prefer-strict-equal': 'error',
  'jest/prefer-to-be': 'error',
  'jest/prefer-called-with': 'error',
  'jest/no-focused-tests': 'error',
};
