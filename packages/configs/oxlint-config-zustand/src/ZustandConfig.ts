import { typescriptConfig } from '@brutalway/oxlint-config-typescript';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

function resolveFromHere(specifier: string) {
  return fileURLToPath(import.meta.resolve(specifier));
}

export const zustandConfig: OxlintConfig = defineConfig({
  extends: [typescriptConfig],
  jsPlugins: [
    { name: 'store-layout', specifier: resolveFromHere('@brutalway/eslint-plugin-store-layout') },
    { name: 'selector-naming', specifier: fileURLToPath(new URL('./plugin.js', import.meta.url)) },
    {
      name: 'store-selector',
      specifier: fileURLToPath(new URL('./storeSelectorPlugin.js', import.meta.url)),
    },
  ],
  rules: {
    'store-layout/store-layout': 'error',
    'store-selector/no-restricted-syntax': [
      'error',
      {
        selector:
          "CallExpression[callee.name='useStore'][arguments.length=1], CallExpression[callee.name=/^use[A-Z]\\w*Store$/u][arguments.length=0]",
        message:
          'A store hook takes a selector: useStore(xStore, selectX) re-renders the component only when what it selects changes, without one it re-renders on every change of the store.',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*Selectors.ts'],
      rules: {
        'selector-naming/no-restricted-syntax': [
          'error',
          {
            selector:
              'ExportNamedDeclaration > FunctionDeclaration > Identifier.id[name!=/^select[A-Z]/]',
            message: 'An XSelectors.ts file only exports selectors named selectX.',
          },
        ],
      },
    },
    {
      files: ['**/*Store.ts'],
      rules: {
        'file-named-after-export/file-named-after-export': 'off',
        'export-placement/no-restricted-syntax': [
          'error',
          {
            selector:
              'ExportNamedDeclaration > :matches(TSTypeAliasDeclaration, TSInterfaceDeclaration)',
            message: 'Exported types belong in an XTypes.ts file (types/ folder).',
          },
        ],
      },
    },
  ],
});
