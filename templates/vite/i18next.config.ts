import { existsSync } from 'node:fs';
import { defineConfig } from 'i18next-cli';

function namespaceFolder(namespace: string): string {
  if (namespace === 'app') return 'src/app';
  const feature = namespace.replaceAll(/([a-z0-9])([A-Z])/gu, '$1-$2').toLowerCase();
  const folder = `src/features/${feature}`;
  if (!existsSync(folder)) {
    throw new Error(`The namespace ${namespace} has no folder ${folder}: name it after a feature.`);
  }
  return folder;
}

export default defineConfig({
  locales: ['en'],
  extract: {
    input: ['src/**/*.{ts,tsx}'],
    ignore: ['src/**/*.test.{ts,tsx}'],
    output: (language, namespace = 'app') =>
      `${namespaceFolder(namespace)}/locales/${language}/${namespace}.json`,
    defaultNS: 'app',
  },
  types: {
    input: ['src/**/locales/en/*.json'],
    output: 'node_modules/.cache/i18next/i18next.d.ts',
    resourcesFile: 'node_modules/.cache/i18next/resources.d.ts',
  },
});
