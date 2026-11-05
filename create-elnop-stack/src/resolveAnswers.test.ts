import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveAnswers } from './resolveAnswers.ts';
import type { StackOption } from './StackTypes.ts';

const OPTIONS: StackOption[] = [
  { id: 'example', message: 'example', default: true, requires: { store: true } },
  { id: 'store', message: 'store', default: true },
  { id: 'e2e', message: 'e2e', default: false },
];

describe('resolveAnswers', () => {
  it('takes the defaults when nothing is asked', async () => {
    assert.deepStrictEqual(await resolveAnswers(OPTIONS, {}, undefined), { example: true, store: true, e2e: false });
  });

  it('skips the question of an option forced by an earlier answer', async () => {
    const asked: string[] = [];
    await resolveAnswers(OPTIONS, {}, async (option) => {
      asked.push(option.id);
      return true;
    });
    assert.deepStrictEqual(asked, ['example', 'e2e']);
  });

  it('asks a required option once the option requiring it is off', async () => {
    assert.deepStrictEqual(await resolveAnswers(OPTIONS, { example: false }, async () => false), { example: false, store: false, e2e: false });
  });

  it('rejects a flag that contradicts a requirement', async () => {
    await assert.rejects(resolveAnswers(OPTIONS, { example: true, store: false }, undefined), /--no-store cannot be used with --example/u);
  });
});
