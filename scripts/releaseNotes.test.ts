import assert from 'node:assert/strict';
import { test } from 'node:test';
import { releaseNotes } from './releaseNotes.ts';

const changelog = ['# @brutalway/x', '', '## 0.2.0', '', '### Minor Changes', '', '- New rule.', '', '## 0.1.10', '', '- Fix.', '', '## 0.1.1', '', '- First fix.', ''].join('\n');

test('the section of a version stops at the next version', () => {
  assert.equal(releaseNotes(changelog, '0.2.0'), '### Minor Changes\n\n- New rule.');
});

test('a version matches its heading exactly', () => {
  assert.equal(releaseNotes(changelog, '0.1.1'), '- First fix.');
});

test('a version without a section has no notes', () => {
  assert.equal(releaseNotes(changelog, '0.1.0'), undefined);
});
