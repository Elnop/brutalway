import assert from 'node:assert/strict';
import { test } from 'node:test';
import { hasWarning } from './hasWarning.ts';

test('a clean output has no warning', () => {
  assert.equal(
    hasWarning('Checking formatting...\nAll matched files use Prettier code style!\n'),
    false,
  );
});

test('a line that starts with Warning is a warning', () => {
  assert.equal(hasWarning('Found 0 clones.\nWarning: something went wrong\n'), true);
});

test('jscpd analyzing no files is tolerated', () => {
  assert.equal(
    hasWarning('Found 0 clones.\nWarning: jscpd analyzed no files: check the paths\n'),
    false,
  );
});

test('a tolerated warning does not hide another one', () => {
  assert.equal(
    hasWarning('Warning: jscpd analyzed no files: check the paths\nWarning: other\n'),
    true,
  );
});

test('a line that starts with npm warn is a warning', () => {
  assert.equal(hasWarning('npm warn config production Use `--omit=dev` instead.\n'), true);
});

test('a count of warnings above zero is a warning', () => {
  assert.equal(hasWarning('Found 2 warnings and 0 errors.\n'), true);
});

test('a count of zero warnings is not a warning', () => {
  assert.equal(hasWarning('Found 0 warnings and 0 errors.\n'), false);
});

test('a test named after warnings is not a warning', () => {
  assert.equal(hasWarning('  ✔ warns on each changed file cited by a doc (406ms)\n'), false);
});

test('the color codes around a warning do not hide it', () => {
  assert.equal(hasWarning('\u001B[33mWarning\u001B[39m: something\n'), true);
});
