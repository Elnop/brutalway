import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

describe('maxFunctions', () => {
  it('reports the sixth top-level function of a file, and ignores the functions nested in another one', () => {
    const hits = lintFixture(fileURLToPath(new URL('../../../fixtures', import.meta.url))).filter(
      (hit) => hit.includes('max-functions'),
    );
    assert.deepEqual(hits, ['toolbox.ts:21 function-size(max-functions)']);
  });
});
