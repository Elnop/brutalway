import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

describe('reactNativeConfig', () => {
  it('takes styles from the theme, keeps them out of JSX and accepts the route files of app/', () => {
    assert.deepEqual(lintFixture(fileURLToPath(new URL('../fixtures', import.meta.url))), [
      'src/app/I18nProvider.tsx:5 file-named-after-export(file-named-after-export)',
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
});
