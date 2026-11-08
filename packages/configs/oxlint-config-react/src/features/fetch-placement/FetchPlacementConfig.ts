import type { OxlintOverride } from 'oxlint';

export const fetchPlacementOverrides: OxlintOverride[] = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'fetch-placement/no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name=/^use(Layout)?Effect$/] CallExpression[callee.name="fetch"]',
          message: 'No fetch in an effect: server data goes through a query hook, and the request lives in an xClient.ts.',
        },
        {
          selector: 'CallExpression[callee.name="fetch"]:not(CallExpression[callee.name=/^use(Layout)?Effect$/] CallExpression)',
          message: 'Only an xClient.ts file calls fetch: move this request into the client of that API.',
        },
      ],
    },
  },
  { files: ['**/*Client.ts'], rules: { 'fetch-placement/no-restricted-syntax': 'off' } },
];
