import { deepStrictEqual } from 'node:assert';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

test('reactConfig checks component props and roles, hooks, fetch and storage next to the TypeScript conventions', () => {
  deepStrictEqual(lintFixture(fileURLToPath(new URL('fixtures', import.meta.url))), [
    'Cards.tsx:4 export-placement(no-restricted-syntax)',
    'Cards.tsx:6 component-props(no-restricted-syntax)',
    'Cards.tsx:10 component-props(no-restricted-syntax)',
    'Cards.tsx:14 component-props(no-restricted-syntax)',
    'counters.ts:3 hook-naming(no-restricted-syntax)',
    'Feed.tsx:6 fetch-placement(no-restricted-syntax)',
    'Gallery.tsx:8 component-roles(no-restricted-syntax)',
    'Gallery.tsx:15 component-roles(no-restricted-syntax)',
    'Gallery.tsx:17 component-roles(no-restricted-syntax)',
    'Gallery.tsx:20 react(no-array-index-key)',
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
