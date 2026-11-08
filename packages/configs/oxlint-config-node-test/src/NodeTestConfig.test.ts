import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

describe('nodeTestConfig', () => {
  it('rejects test(), node:assert and a top-level it(), and accepts it() inside describe() with node:assert/strict', () => {
    assert.deepEqual(lintFixture(fileURLToPath(new URL('../fixtures', import.meta.url))), [
      'bad.test.ts:1 node-test(no-restricted-syntax)',
      'bad.test.ts:2 node-test(no-restricted-syntax)',
      'bad.test.ts:8 node-test(no-restricted-syntax)',
    ]);
  });
});
