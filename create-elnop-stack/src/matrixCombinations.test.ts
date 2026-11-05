import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { matrixCombinations } from './matrixCombinations.ts';

describe('matrixCombinations', () => {
  it('crosses the options, drops the ones breaking a requirement and alternates independent options', () => {
    const combinations = matrixCombinations([
      { id: 'example', message: '', default: true, requires: { store: true } },
      { id: 'store', message: '', default: true },
      { id: 'hook', message: '', default: true, independent: true },
    ]);
    assert.deepStrictEqual(combinations, [
      { example: true, store: true, hook: true },
      { example: false, store: true, hook: false },
      { example: false, store: false, hook: true },
    ]);
  });
});
