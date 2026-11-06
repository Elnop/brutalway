import assert from 'node:assert';
import { it, test } from 'node:test';

test('adds', () => {
  assert.equal(1 + 1, 2);
});

it('subtracts', () => {
  assert.equal(2 - 1, 1);
});
