import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { baseName } from '#src/baseName.ts';

describe('baseName', () => {
  it('drops the folders and the last extension', () => {
    assert.equal(baseName('src/features/users/usersClient.ts'), 'usersClient');
    assert.equal(baseName('src/components/Formula.test.tsx'), 'Formula.test');
  });

  it('keeps a name without extension or folder', () => {
    assert.equal(baseName('Makefile'), 'Makefile');
    assert.equal(baseName('src/'), '');
  });
});
