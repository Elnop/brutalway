import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

describe('reactConfig', () => {
  it('checks component props and roles, hooks, fetch and storage next to the TypeScript conventions', () => {
    assert.deepEqual(lintFixture(fileURLToPath(new URL('../fixtures', import.meta.url))), [
      'Cards.tsx:4 export-placement(no-restricted-syntax)',
      'Cards.tsx:6 component-props(no-restricted-syntax)',
      'Cards.tsx:10 component-props(no-restricted-syntax)',
      'Cards.tsx:14 component-props(no-restricted-syntax)',
      'Clock.tsx:7 react-hooks(exhaustive-deps)',
      'Clock.tsx:8 react(exhaustive-effect-dependencies)',
      'counters.ts:3 hook-naming(no-restricted-syntax)',
      'Feed.tsx:6 fetch-placement(no-restricted-syntax)',
      'Gallery.tsx:8 component-roles(no-restricted-syntax)',
      'Gallery.tsx:15 component-roles(no-restricted-syntax)',
      'Gallery.tsx:17 component-roles(no-restricted-syntax)',
      'Gallery.tsx:20 react(no-array-index-key)',
      'Label.tsx:3 export-placement(no-restricted-syntax)',
      'Label.tsx:3 react(only-export-components)',
      'MenuTypes.ts:1 component-props(no-restricted-syntax)',
      'Picker.tsx:1 component-props(no-restricted-syntax)',
      'Picker.tsx:5 react(jsx-curly-brace-presence)',
      'ping.ts:2 fetch-placement(no-restricted-syntax)',
      'readTheme.ts:2 eslint(no-restricted-globals)',
      'ScoreLayout.tsx:5 component-roles(no-restricted-syntax)',
      'shared-features/todos/TodosContainer.tsx:1 check-file(filename-blocklist)',
      'shared-features/todos/TodosContainer.tsx:1 component-roles(no-restricted-syntax)',
      'Toggle.tsx:7 react-hooks(rules-of-hooks)',
      'useBadge.tsx:1 hook-files(no-restricted-syntax)',
      'useCounter.ts:7 hook-naming(no-restricted-syntax)',
    ]);
  });
});
