import { reactViteConfig } from '@elnop/oxlint-config-react-vite';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactViteConfig],
  ignorePatterns: ['dist'],
  overrides: [{ files: ['*.config.ts'], rules: { 'no-restricted-imports': 'off' } }],
  rules: {
    'no-restricted-imports': ['error', { patterns: [{ regex: '^\\.\\.?/', message: 'Relative imports are not allowed: import through an alias (@/ in src/, @e2e/ in e2e/).' }] }],
  },
});
