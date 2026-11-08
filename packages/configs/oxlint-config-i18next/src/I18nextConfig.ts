import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

const WITHOUT_LETTERS = '[^A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u024F\\u0370-\\u03FF\\u0400-\\u04FF\\u0590-\\u06FF\\u3040-\\u30FF\\u4E00-\\u9FFF\\uAC00-\\uD7AF]+';

export const i18nextConfig: OxlintConfig = defineConfig({
  jsPlugins: [{ name: 'i18next', specifier: fileURLToPath(import.meta.resolve('eslint-plugin-i18next')) }],
  rules: {
    'i18next/no-literal-string': [
      'error',
      {
        mode: 'jsx-only',
        'should-validate-template': true,
        'jsx-attributes': { include: ['aria-label', 'aria-description', 'placeholder', 'title', 'alt'] },
        words: { exclude: [WITHOUT_LETTERS, '[A-Z_-]+'] },
      },
    ],
  },
  overrides: [{ files: ['**/*.test.tsx'], rules: { 'i18next/no-literal-string': 'off' } }],
});
