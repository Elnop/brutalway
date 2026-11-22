import type { DummyRuleMap, OxlintOverride } from 'oxlint';

export const storageRules: DummyRuleMap = {
  'storage-placement/no-restricted-syntax': [
    'error',
    {
      selector: "ImportDeclaration[source.value='@react-native-async-storage/async-storage']",
      message:
        'Only an xStorage.ts file reads and writes AsyncStorage: move this call into the xStorage.ts file of its feature or shared feature, and import its functions.',
    },
  ],
};

export const storageOverrides: OxlintOverride[] = [
  { files: ['**/*Storage.ts'], rules: { 'storage-placement/no-restricted-syntax': 'off' } },
];
