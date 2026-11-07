import { deepStrictEqual } from 'node:assert';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

test('tanstackQueryConfig checks query keys, cache windows and dependencies', () => {
  deepStrictEqual(lintFixture(fileURLToPath(new URL('fixtures', import.meta.url))), [
    'useNotes.ts:5 query-conventions(named-cache-windows)',
    'useNotes.ts:12 query-conventions(named-cache-windows)',
    'useNotes.ts:12 query-conventions(query-key-factory)',
    'useNotes.ts:12 tanstack-query(exhaustive-deps)',
    'useNotes.ts:19 query-conventions(query-key-factory)',
  ]);
});
