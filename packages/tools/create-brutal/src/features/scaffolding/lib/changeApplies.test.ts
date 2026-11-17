import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { changeApplies } from '#src/features/scaffolding/lib/changeApplies.ts';

describe('changeApplies', () => {
  it('applies a change when every answer equals its condition', () => {
    const change = { when: { example: true, styling: 'tailwind' } };
    assert.equal(changeApplies(change, { example: true, styling: 'tailwind' }), true);
    assert.equal(changeApplies(change, { example: true, styling: 'css' }), false);
  });

  it('applies a change when the answer is one of the values of a list', () => {
    const change = { when: { i18n: ['none', 'en'] } };
    assert.equal(changeApplies(change, { i18n: 'en' }), true);
    assert.equal(changeApplies(change, { i18n: 'none' }), true);
    assert.equal(changeApplies(change, { i18n: 'en-fr' }), false);
  });

  it('leaves out a change whose option was not answered', () => {
    assert.equal(changeApplies({ when: { i18n: ['none', 'en'] } }, {}), false);
  });
});
