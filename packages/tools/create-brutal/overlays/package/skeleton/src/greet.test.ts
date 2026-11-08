import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as exported from '#src/greet.ts';

describe('the "." export', () => {
  it('exports greet, which greets the name it gets', () => {
    assert.deepEqual(Object.keys(exported), ['greet']);
    assert.equal(exported.greet('__PROJECT_NAME__'), 'Hello, __PROJECT_NAME__.');
  });
});
