import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveAnswers } from './resolveAnswers.ts';
import type { StackOption } from './StackTypes.ts';

const OPTIONS: StackOption[] = [
  { id: 'example', message: 'example', default: true, requires: { store: true } },
  { id: 'store', message: 'store', default: true },
  { id: 'e2e', message: 'e2e', default: false },
];

const STYLED: StackOption[] = [
  {
    id: 'styling',
    message: 'styling',
    default: 'css',
    values: [
      { id: 'css', label: 'CSS' },
      { id: 'tailwind', label: 'Tailwind' },
    ],
  },
  {
    id: 'ui',
    message: 'ui',
    default: 'none',
    values: [
      { id: 'none', label: 'None' },
      { id: 'shadcn', label: 'shadcn/ui', conflicts: { styling: 'css' } },
    ],
  },
  { id: 'i18n', message: 'i18n', default: false },
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

  it('skips the question of an option that a later flag rules out', async () => {
    const asked: string[] = [];
    const answers = await resolveAnswers(OPTIONS, { store: false }, async (option) => {
      asked.push(option.id);
      return true;
    });
    assert.deepStrictEqual(answers, { example: false, store: false, e2e: true });
    assert.deepStrictEqual(asked, ['e2e']);
  });

  it('rejects a flag that contradicts a requirement', async () => {
    await assert.rejects(resolveAnswers(OPTIONS, { example: true, store: false }, undefined), /--example cannot be used with --no-store/u);
  });

  it('takes a value of a choice option and an opt-in option', async () => {
    assert.deepStrictEqual(await resolveAnswers(STYLED, { styling: 'tailwind', ui: 'shadcn', i18n: true }, undefined), { styling: 'tailwind', ui: 'shadcn', i18n: true });
  });

  it('rejects a value the option does not have', async () => {
    await assert.rejects(resolveAnswers(STYLED, { styling: 'bootstrap' }, undefined), /styling has no value bootstrap\. Choose one of: css, tailwind/u);
    await assert.rejects(resolveAnswers(STYLED, { i18n: 'yes' }, undefined), /i18n takes true or false/u);
  });

  it('rejects two conflicting values before anything else, naming both options', async () => {
    await assert.rejects(resolveAnswers(STYLED, { ui: 'shadcn', styling: 'css' }, undefined), /--styling css cannot be used with --ui shadcn/u);
  });

  it('only offers the values that do not conflict with an earlier answer', async () => {
    const offered: unknown[] = [];
    const answers = await resolveAnswers(STYLED, { styling: 'css' }, async (option, allowed) => {
      offered.push([option.id, allowed]);
      return allowed[0] ?? false;
    });
    assert.deepStrictEqual(answers, { styling: 'css', ui: 'none', i18n: true });
    assert.deepStrictEqual(offered, [['i18n', [true, false]]]);
  });
});
