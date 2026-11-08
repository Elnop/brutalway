import type { OxlintOverride } from 'oxlint';

export const hookNamingOverrides: OxlintOverride[] = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'hook-naming/no-restricted-syntax': ['error', { selector: 'ExportNamedDeclaration > FunctionDeclaration[id.name=/^use[A-Z]/]', message: 'A hook lives in its own useX.ts file.' }],
    },
  },
  {
    files: ['**/use*.ts', '**/use*.tsx'],
    rules: {
      'hook-naming/no-restricted-syntax': [
        'error',
        { selector: 'ExportNamedDeclaration > FunctionDeclaration[id.name!=/^use[A-Z]/]', message: 'A useX.ts file only exports hooks named useX: move this function out of it.' },
      ],
    },
  },
];
