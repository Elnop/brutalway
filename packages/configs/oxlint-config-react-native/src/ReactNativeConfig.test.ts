import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

function fixture(name: string): string {
  return fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url));
}

function diagnostics(name: string, folder: string): string[] {
  return lintFixture(fixture(name)).filter((line) => line.startsWith(folder));
}

describe('reactNativeConfig', () => {
  it('takes styles from the theme and keeps them out of JSX', () => {
    assert.deepEqual(diagnostics('rules', 'src/features/'), [
      'src/features/i18n/I18nProvider.tsx:5 file-named-after-export(file-named-after-export)',
      'src/features/i18n/I18nProvider.tsx:5 import(no-default-export)',
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

  it('checks a route of src/app/ against every rule that is not about names, exports or props', () => {
    assert.deepEqual(diagnostics('rules', 'src/app/'), [
      'src/app/todos.tsx:2 eslint(no-restricted-imports)',
      'src/app/todos.tsx:4 theme-styles(no-restricted-syntax)',
      'src/app/todos.tsx:4 theme-styles(no-restricted-syntax)',
      'src/app/todos.tsx:6 no-comments(disallowComments)',
      'src/app/todos.tsx:7 typescript(no-explicit-any)',
      'src/app/todos.tsx:8 eslint(no-nested-ternary)',
      'src/app/todos.tsx:9 eslint(no-console)',
      'src/app/todos.tsx:10 component-roles(no-restricted-syntax)',
      'src/app/todos.tsx:12 react-native(no-raw-text)',
      'src/app/todos.tsx:12 theme-styles(no-restricted-syntax)',
    ]);
  });

  it('accepts every file Expo Router names, with the exports it asks for', () => {
    assert.deepEqual(lintFixture(fixture('conventions')), []);
  });
});
