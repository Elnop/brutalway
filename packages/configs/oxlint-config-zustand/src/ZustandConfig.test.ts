import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

describe('zustandConfig', () => {
  it('checks store files', () => {
    assert.deepEqual(lintFixture(fileURLToPath(new URL('../fixtures', import.meta.url))), [
      'cartSelectors.ts:5 selector-naming(no-restricted-syntax)',
      'cartStore.ts:1 store-layout(store-layout)',
      'viewStore.ts:3 export-placement(no-restricted-syntax)',
      'viewStore.ts:3 store-layout(store-layout)',
      'viewStore.ts:6 store-layout(store-layout)',
    ]);
  });
});
