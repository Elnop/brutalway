import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import plugin from '#src/plugin.ts';
import { storeLayout } from '#src/features/store-layout/storeLayout.ts';

describe('plugin', () => {
  it('exposes the rule as store-layout/store-layout', () => {
    assert.equal(plugin.meta?.name, 'store-layout');
    assert.deepEqual(plugin.rules, { 'store-layout': storeLayout });
  });
});
