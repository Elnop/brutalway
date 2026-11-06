import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { applyFileEdit } from './applyFileEdit.ts';

const README = '# app\n\nintro\n\n## Agent\n\nhook text\n\n### Detail\n\nmore\n\n## Next\n\nsteps\n';

describe('applyFileEdit', () => {
  it('replaces text found exactly once', () => {
    assert.strictEqual(applyFileEdit('a b c', { file: 'x', replace: 'b', with: 'B' }), 'a B c');
  });

  it('rejects text found zero or several times', () => {
    assert.throws(() => applyFileEdit('a b b', { file: 'x', replace: 'b', with: 'B' }), /found it 2 times/u);
    assert.throws(() => applyFileEdit('a', { file: 'x', replace: 'b', with: 'B' }), /found it 0 times/u);
  });

  it('replaces every occurrence when asked to', () => {
    assert.strictEqual(applyFileEdit('a b b', { file: 'x', replace: 'b', with: 'B', all: true }), 'a B B');
    assert.throws(() => applyFileEdit('a', { file: 'x', replace: 'b', with: 'B', all: true }), /not found/u);
  });

  it('drops matching lines without leaving a double blank line', () => {
    assert.strictEqual(applyFileEdit('a\n\ndrop me\n\nb\n', { file: 'x', dropLines: 'drop' }), 'a\n\nb\n');
  });

  it('drops a section with its subsections up to the next heading of the same level', () => {
    assert.strictEqual(applyFileEdit(README, { file: 'x', dropSection: '## Agent' }), '# app\n\nintro\n\n## Next\n\nsteps\n');
  });

  it('drops the last section up to the end of the file', () => {
    assert.strictEqual(applyFileEdit(README, { file: 'x', dropSection: '## Next' }), '# app\n\nintro\n\n## Agent\n\nhook text\n\n### Detail\n\nmore\n');
  });
});
