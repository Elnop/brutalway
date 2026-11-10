import assert from 'node:assert/strict';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { lintFixture } from '#src/lintFixture.ts';

const FIXTURE = join(import.meta.dirname, '..', 'fixtures', 'lint-fixture');

describe('lintFixture', () => {
  it('runs oxlint with the config of the folder and lists one file:line rule per diagnostic, sorted by file, line and rule', () => {
    assert.deepEqual(lintFixture(FIXTURE), [
      'first.js:2 eslint(no-debugger)',
      'first.js:3 eslint(no-empty)',
      'second.js:2 eslint(no-debugger)',
    ]);
  });

  it('throws when the folder does not exist', () => {
    assert.throws(() => lintFixture(join(FIXTURE, 'missing')));
  });
});
