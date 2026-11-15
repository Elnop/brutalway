import type { OxlintOverride } from 'oxlint';
import { ROUTER_FILES } from '#src/shared/RouterFilesConfig.ts';

export const routerFilesOverrides: OxlintOverride[] = [
  {
    files: ROUTER_FILES,
    rules: {
      'unicorn/filename-case': 'off',
      'import/no-default-export': 'off',
      'file-named-after-export/file-named-after-export': 'off',
      'export-placement/no-restricted-syntax': 'off',
      'react/only-export-components': 'off',
      'hook-naming/no-restricted-syntax': 'off',
      'component-props/no-restricted-syntax': 'off',
    },
  },
];
