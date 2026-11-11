import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['en'],
  extract: {
    input: ['src/**/*.{ts,tsx}'],
    ignore: ['src/**/*.test.{ts,tsx}'],
    output: 'src/app/locales/{{language}}/{{namespace}}.json',
    defaultNS: 'app',
  },
  types: {
    input: ['src/app/locales/en/*.json'],
    output: 'node_modules/.cache/i18next/i18next.d.ts',
    resourcesFile: 'node_modules/.cache/i18next/resources.d.ts',
  },
});
