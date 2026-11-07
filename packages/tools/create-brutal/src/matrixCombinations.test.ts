import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { matrixCombinations } from './matrixCombinations.ts';
import type { Answers, StackOption } from './StackTypes.ts';

const TOGGLES: StackOption[] = [
  { id: 'example', message: '', default: true, requires: { store: true } },
  { id: 'store', message: '', default: true },
  { id: 'hook', message: '', default: true, independent: true },
];

function choice(id: string, values: string[]): StackOption {
  return { id, message: '', default: values[0] ?? '', values: values.map((value) => ({ id: value, label: value })) };
}

function pairsOf(rows: Answers[], left: string, right: string): Set<string> {
  return new Set(rows.map((answers) => `${String(answers[left])} ${String(answers[right])}`));
}

describe('matrixCombinations', () => {
  it('crosses every option when asked to, drops the ones breaking a requirement and alternates independent options', () => {
    assert.deepStrictEqual(matrixCombinations(TOGGLES, true), [
      { example: true, store: true, hook: true },
      { example: false, store: true, hook: false },
      { example: false, store: false, hook: true },
    ]);
  });

  it('starts from the defaults and covers every pair of values that can happen', () => {
    const options: StackOption[] = [...['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, message: '', default: true })), choice('styling', ['css', 'tailwind', 'modules'])];
    const rows = matrixCombinations(options);
    assert.deepStrictEqual(rows[0], { a: true, b: true, c: true, d: true, e: true, f: true, styling: 'css' });
    assert.ok(rows.length <= 10, `${rows.length} rows`);
    for (const left of ['a', 'b', 'c', 'd', 'e', 'f']) {
      assert.strictEqual(pairsOf(rows, left, 'styling').size, 6);
      for (const right of ['a', 'b', 'c', 'd', 'e', 'f'].filter((id) => id > left)) assert.strictEqual(pairsOf(rows, left, right).size, 4);
    }
  });

  it('crosses the values of choice options with each other and respects conflicts', () => {
    const options: StackOption[] = [
      choice('styling', ['css', 'tailwind']),
      {
        id: 'ui',
        message: '',
        default: 'none',
        values: [
          { id: 'none', label: '' },
          { id: 'shadcn', label: '', requires: { styling: 'tailwind' } },
        ],
      },
      choice('theme', ['light', 'dark']),
      { ...choice('icons', ['lucide', 'none']), independent: true },
    ];
    const rows = matrixCombinations(options);
    assert.strictEqual(new Set(rows.map((answers) => `${String(answers['styling'])} ${String(answers['ui'])} ${String(answers['theme'])}`)).size, 6);
    assert.ok(rows.every((answers) => answers['ui'] !== 'shadcn' || answers['styling'] === 'tailwind'));
    assert.deepStrictEqual(new Set(rows.map((answers) => answers['icons'])), new Set(['lucide', 'none']));
  });

  it('keeps the fixed values in every row and still covers the pairs of the other options', () => {
    const options: StackOption[] = ['a', 'b', 'c', 'd'].map((id) => ({ id, message: '', default: true }));
    const rows = matrixCombinations(options, false, { a: false, b: true });
    assert.ok(rows.every((answers) => answers['a'] === false && answers['b'] === true));
    assert.deepStrictEqual(pairsOf(rows, 'c', 'd'), new Set(['true true', 'true false', 'false true', 'false false']));
  });
});
