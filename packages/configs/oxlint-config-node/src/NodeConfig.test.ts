import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

describe('nodeConfig', () => {
  it('rejects relative imports and fetch outside an xClient.ts, on top of the TypeScript base', () => {
    assert.deepEqual(lintFixture(fileURLToPath(new URL('../fixtures', import.meta.url))), [
      'src/shared/loadUser.ts:1 eslint(no-restricted-imports)',
      'src/shared/loadUser.ts:4 eslint(no-restricted-globals)',
    ]);
  });
});
