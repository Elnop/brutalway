import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

function fixture(name: string): string {
  return fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url));
}

describe('reactNativeConfig', () => {
  it('takes styles from the theme and keeps them out of JSX', () => {
    assert.deepEqual(lintFixture(fixture('rules')), [
      'src/features/i18n/I18nProvider.tsx:5 file-named-after-export(file-named-after-export)',
      'src/features/profile/Avatar.test.tsx:5 jest(prefer-strict-equal)',
      'src/features/profile/Avatar.tsx:1 react-native(split-platform-components)',
      'src/features/profile/Avatar.tsx:8 react-native(no-single-element-style-arrays)',
      'src/features/profile/Avatar.tsx:9 theme-styles(no-restricted-syntax)',
      'src/features/profile/Avatar.tsx:10 react-native(no-raw-text)',
      'src/features/profile/Avatar.tsx:10 theme-styles(no-restricted-syntax)',
      'src/features/profile/Avatar.tsx:18 theme-styles(no-restricted-syntax)',
      'src/features/profile/Avatar.tsx:19 theme-styles(no-restricted-syntax)',
      'src/features/profile/Avatar.tsx:20 theme-styles(no-restricted-syntax)',
      'src/features/profile/Avatar.tsx:21 theme-styles(no-restricted-syntax)',
      'src/features/profile/Avatar.tsx:22 theme-styles(no-restricted-syntax)',
      'src/features/profile/Avatar.tsx:23 theme-styles(no-restricted-syntax)',
      'src/features/profile/Avatar.tsx:25 theme-styles(no-restricted-syntax)',
      'src/features/profile/Avatar.tsx:26 react-native(no-unused-styles)',
    ]);
  });

  it('accepts every file Expo Router names, with the exports it asks for', () => {
    assert.deepEqual(lintFixture(fixture('conventions')), []);
  });
});
