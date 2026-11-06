import { typescriptConfig } from '@brutal/oxlint-config-typescript';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

function resolveFromHere(specifier: string) {
  return fileURLToPath(import.meta.resolve(specifier));
}

export const zustandConfig: OxlintConfig = defineConfig({
  extends: [typescriptConfig],
  jsPlugins: [
    { name: 'store-layout', specifier: resolveFromHere('@brutal/eslint-plugin-store-layout') },
    { name: 'selector-naming', specifier: fileURLToPath(new URL('./plugin.js', import.meta.url)) },
  ],
  rules: { 'store-layout/store-layout': 'error' },
  overrides: [
    {
      files: ['**/*Selectors.ts'],
      rules: {
        'selector-naming/no-restricted-syntax': [
          'error',
          { selector: 'ExportNamedDeclaration > FunctionDeclaration > Identifier.id[name!=/^select[A-Z]/]', message: 'An XSelectors.ts file only exports selectors named selectX.' },
        ],
      },
    },
    {
      files: ['**/*Store.ts'],
      rules: {
        'file-named-after-export/file-named-after-export': 'off',
        'export-placement/no-restricted-syntax': [
          'error',
          { selector: 'ExportNamedDeclaration > :matches(TSTypeAliasDeclaration, TSInterfaceDeclaration)', message: 'Exported types belong in an XTypes.ts file (types/ folder).' },
        ],
      },
    },
  ],
});
