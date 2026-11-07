import { deepStrictEqual } from 'node:assert';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

test('reactConfig checks component props, callback props and hooks next to the TypeScript conventions', () => {
  deepStrictEqual(lintFixture(fileURLToPath(new URL('fixtures', import.meta.url))), [
    'Cards.tsx:4 export-placement(no-restricted-syntax)',
    'Cards.tsx:6 component-props(no-restricted-syntax)',
    'Cards.tsx:10 component-props(no-restricted-syntax)',
    'Cards.tsx:14 component-props(no-restricted-syntax)',
    'counters.ts:3 hook-naming(no-restricted-syntax)',
    'Feed.tsx:6 fetch-placement(no-restricted-syntax)',
    'Picker.tsx:1 component-props(no-restricted-syntax)',
    'Picker.tsx:5 react(jsx-curly-brace-presence)',
    'ping.ts:2 fetch-placement(no-restricted-syntax)',
    'shared-features/todos/TodosContainer.tsx:1 check-file(filename-blocklist)',
    'Toggle.tsx:7 react-hooks(rules-of-hooks)',
    'useCounter.ts:7 hook-naming(no-restricted-syntax)',
  ]);
});
