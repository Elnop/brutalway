import type { OxlintOverride } from 'oxlint';

export const routerFilesOverrides: OxlintOverride[] = [
  {
    files: ['src/app/**'],
    rules: {
      'unicorn/filename-case': 'off',
      'import/no-default-export': 'off',
      'check-file/no-index': 'off',
      'file-named-after-export/file-named-after-export': 'off',
      'export-placement/no-restricted-syntax': 'off',
      'react/only-export-components': 'off',
      'hook-naming/no-restricted-syntax': 'off',
      'component-props/no-restricted-syntax': 'off',
    },
  },
];
