import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

export const tailwindConfig: OxlintConfig = defineConfig({
  jsPlugins: [
    { name: 'tailwind', specifier: fileURLToPath(new URL('./plugin.js', import.meta.url)) },
  ],
  rules: {
    'tailwind/color-tokens': ['error', { stylesheet: 'src/app/globals.css' }],
    'tailwind/font-roles': 'error',
    'tailwind/no-dark-variant': 'error',
  },
});
