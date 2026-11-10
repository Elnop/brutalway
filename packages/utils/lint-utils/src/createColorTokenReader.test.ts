import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, describe, it } from 'node:test';
import { createColorTokenReader } from '#src/createColorTokenReader.ts';
import type { ColorToken } from '#src/ColorTypes.ts';

const folder = mkdtempSync(join(tmpdir(), 'color-utils-'));

after(() => rmSync(folder, { recursive: true, force: true }));

function countingReader() {
  const parsed: string[] = [];
  const read = createColorTokenReader((css): ColorToken[] => {
    parsed.push(css);
    return [{ name: css.trim(), color: undefined }];
  });
  return { parsed, read };
}

describe('createColorTokenReader', () => {
  it('parses a stylesheet once while its mtime stays the same', () => {
    const path = join(folder, 'same.css');
    writeFileSync(path, 'ink');
    const { parsed, read } = countingReader();
    const first = read(path);
    assert.deepEqual(first, [{ name: 'ink', color: undefined }]);
    assert.equal(read(path), first);
    assert.deepEqual(parsed, ['ink']);
  });

  it('parses the stylesheet again once its mtime changes', () => {
    const path = join(folder, 'changed.css');
    writeFileSync(path, 'ink');
    const { parsed, read } = countingReader();
    read(path);
    writeFileSync(path, 'paper');
    utimesSync(path, new Date(2030, 0, 1), new Date(2030, 0, 1));
    assert.deepEqual(read(path), [{ name: 'paper', color: undefined }]);
    assert.deepEqual(parsed, ['ink', 'paper']);
  });

  it('gives no tokens for a missing stylesheet without parsing', () => {
    const { parsed, read } = countingReader();
    assert.deepEqual(read(join(folder, 'missing.css')), []);
    assert.deepEqual(parsed, []);
  });

  it('keeps a separate cache for each reader', () => {
    const path = join(folder, 'shared.css');
    writeFileSync(path, 'ink');
    const left = countingReader();
    const right = countingReader();
    left.read(path);
    right.read(path);
    assert.deepEqual([left.parsed, right.parsed], [['ink'], ['ink']]);
  });
});
