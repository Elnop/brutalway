import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { longDocs } from '#src/features/length-check/longDocs.ts';
import { DEFAULT_SETTINGS } from '#src/shared-features/docs/DocLengthConfig.ts';

describe('longDocs', () => {
  it('reports only the files above the limit, with their number of lines', () => {
    const files = [
      { path: 'long.md', content: 'line\n'.repeat(4) },
      { path: 'short.md', content: 'line\n'.repeat(3) },
      { path: 'unterminated.md', content: 'line\nline\nline\nline' },
    ];
    assert.deepEqual(longDocs(files, { ...DEFAULT_SETTINGS, maxLines: 3 }), [
      { path: 'long.md', lines: 4 },
      { path: 'unterminated.md', lines: 4 },
    ]);
  });
});
