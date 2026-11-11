import type { OxlintOverride } from 'oxlint';

export const routeFilesOverrides: OxlintOverride[] = [
  {
    files: ['**/app/**/[^A-Z]*.tsx'],
    rules: {
      'import/no-default-export': 'off',
      'file-named-after-export/file-named-after-export': 'off',
      'check-file/no-index': 'off',
      'export-placement/no-restricted-syntax': 'off',
      'react/only-export-components': [
        'error',
        { allowExportNames: ['unstable_settings', 'ErrorBoundary', 'generateStaticParams'] },
      ],
    },
  },
];
