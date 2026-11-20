import type { DummyRuleMap, OxlintOverride } from 'oxlint';

const STORAGE_MESSAGE =
  'Only an xStorage.ts file reads and writes the browser storage: move this call into the xStorage.ts file of its feature or shared feature, and import its functions.';

export const storageRules: DummyRuleMap = {
  'no-restricted-globals': [
    'error',
    { name: 'localStorage', message: STORAGE_MESSAGE },
    { name: 'sessionStorage', message: STORAGE_MESSAGE },
  ],
};

export const storageOverrides: OxlintOverride[] = [
  { files: ['**/*Storage.ts'], rules: { 'no-restricted-globals': 'off' } },
];
