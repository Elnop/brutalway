import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { DEFAULT_SETTINGS } from './DocLengthConfig.ts';
import { longDocs, markdownFiles } from './markdownFiles.ts';

test('only the Markdown files above the limit are reported, outside the ignored folders', () => {
  const root = mkdtempSync(join(tmpdir(), 'doc-length-'));
  mkdirSync(join(root, 'docs'));
  mkdirSync(join(root, 'node_modules'));
  writeFileSync(join(root, 'docs/long.md'), 'line\n'.repeat(4));
  writeFileSync(join(root, 'docs/short.md'), 'line\n'.repeat(2));
  writeFileSync(join(root, 'node_modules/long.md'), 'line\n'.repeat(9));
  writeFileSync(join(root, 'CHANGELOG.md'), 'line\n'.repeat(9));
  const settings = { ...DEFAULT_SETTINGS, maxLines: 3 };
  assert.deepEqual(longDocs(markdownFiles(root, settings), settings), [{ path: 'docs/long.md', lines: 4 }]);
});
