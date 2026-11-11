import type { OxlintOverride } from 'oxlint';

const ROUTE_FILES = [
  'page',
  'layout',
  'template',
  'default',
  'loading',
  'error',
  'not-found',
  'global-error',
  'global-not-found',
  'forbidden',
  'unauthorized',
];

const KEBAB_ROUTE_FILES = ['not-found', 'global-error', 'global-not-found'];

const ROUTE_EXPORTS = [
  'generateMetadata',
  'generateViewport',
  'generateStaticParams',
  'metadata',
  'viewport',
  'dynamic',
  'dynamicParams',
  'revalidate',
  'fetchCache',
  'runtime',
  'preferredRegion',
  'maxDuration',
];

export const routeFilesOverrides: OxlintOverride[] = [
  {
    files: [`**/app/**/{${ROUTE_FILES.join(',')}}.tsx`],
    rules: {
      'import/no-default-export': 'off',
      'file-named-after-export/file-named-after-export': 'off',
      'export-placement/no-restricted-syntax': 'off',
      'react/only-export-components': ['error', { allowExportNames: ROUTE_EXPORTS }],
    },
  },
  {
    files: [`**/app/**/{${KEBAB_ROUTE_FILES.join(',')}}.tsx`],
    rules: { 'unicorn/filename-case': 'off' },
  },
  {
    files: ['**/app/**/route.ts'],
    rules: {
      'file-named-after-export/file-named-after-export': 'off',
      'export-placement/no-restricted-syntax': 'off',
    },
  },
];
