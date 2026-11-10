import type { OxlintOverride } from 'oxlint';

export const hookFilesOverrides: OxlintOverride[] = [
  {
    files: ['**/use[A-Z]*.tsx'],
    rules: {
      'hook-files/no-restricted-syntax': [
        'error',
        {
          selector: 'Program',
          message: 'A hook file is a useX.ts: move the JSX into a component and rename this file.',
        },
      ],
    },
  },
];
