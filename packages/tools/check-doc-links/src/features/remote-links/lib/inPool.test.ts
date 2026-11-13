import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { inPool } from '#src/features/remote-links/lib/inPool.ts';

describe('inPool', () => {
  it('results keep the order of the items, with at most the given number running at once', async () => {
    let running = 0;
    let most = 0;
    const results = await inPool([30, 10, 20, 0], 2, async (delay) => {
      running += 1;
      most = Math.max(most, running);
      await new Promise((resolve) => setTimeout(resolve, delay));
      running -= 1;
      return delay * 2;
    });
    assert.deepEqual(results, [60, 20, 40, 0]);
    assert.equal(most, 2);
  });
});
