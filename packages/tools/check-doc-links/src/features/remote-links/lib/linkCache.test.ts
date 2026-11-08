import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { CACHE_MAX_AGE_MS } from '#src/features/remote-links/RemoteLinksConfig.ts';
import { readCache, writeCache } from '#src/features/remote-links/lib/linkCache.ts';

describe('linkCache', () => {
  it('a checked link is skipped for a day, then checked again', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'doc-links-cache-'));
    writeCache(cwd, new Set(), ['https://example.dev/'], 0);
    assert.deepEqual(readCache(cwd, CACHE_MAX_AGE_MS - 1), new Set(['https://example.dev/']));
    assert.deepEqual(readCache(cwd, CACHE_MAX_AGE_MS), new Set());
  });
});
