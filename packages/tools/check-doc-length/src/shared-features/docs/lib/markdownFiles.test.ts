import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { DEFAULT_SETTINGS } from '#src/shared-features/docs/DocLengthConfig.ts';
import { markdownFiles } from '#src/shared-features/docs/lib/markdownFiles.ts';

describe('markdownFiles', () => {
  it('reads the Markdown files of the project, sorted, outside the ignored folders', () => {
    const root = mkdtempSync(join(tmpdir(), 'doc-length-'));
    mkdirSync(join(root, 'docs'));
    mkdirSync(join(root, 'node_modules'));
    writeFileSync(join(root, 'docs/short.md'), 'short\n');
    writeFileSync(join(root, 'docs/long.md'), 'long\n');
    writeFileSync(join(root, 'docs/notes.txt'), 'text\n');
    writeFileSync(join(root, 'node_modules/long.md'), 'module\n');
    writeFileSync(join(root, 'CHANGELOG.md'), 'changes\n');
    assert.deepEqual(markdownFiles(root, DEFAULT_SETTINGS), [
      { path: 'docs/long.md', content: 'long\n' },
      { path: 'docs/short.md', content: 'short\n' },
    ]);
  });
});
