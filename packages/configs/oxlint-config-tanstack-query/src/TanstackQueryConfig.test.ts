import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

describe('tanstackQueryConfig', () => {
  it('checks query keys, cache windows, dependencies and where the QueryClient is created', () => {
    assert.deepEqual(lintFixture(fileURLToPath(new URL('../fixtures', import.meta.url))), [
      'useNotes.ts:5 query-conventions(named-cache-windows)',
      'useNotes.ts:12 query-conventions(named-cache-windows)',
      'useNotes.ts:12 query-conventions(query-key-factory)',
      'useNotes.ts:12 tanstack-query(exhaustive-deps)',
      'useNotes.ts:19 query-conventions(query-key-factory)',
      'useNotes.ts:24 tanstack-query(stable-query-client)',
    ]);
  });
});
