import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

describe('maxVariables', () => {
  it('counts each name a function binds, destructuring included, and counts a nested function apart', () => {
    const hits = lintFixture(fileURLToPath(new URL('../../../fixtures', import.meta.url))).filter((hit) => hit.includes('max-variables'));
    assert.deepEqual(hits, ['gather.ts:1 function-size(max-variables)', 'tally.ts:1 function-size(max-variables)']);
  });
});
