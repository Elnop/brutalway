import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import plugin from '#src/plugin.ts';
import { fileNamedAfterExport } from '#src/features/file-named-after-export/fileNamedAfterExport.ts';

describe('plugin', () => {
  it('exposes the rule as file-named-after-export/file-named-after-export', () => {
    assert.equal(plugin.meta?.name, 'file-named-after-export');
    assert.deepEqual(plugin.rules, { 'file-named-after-export': fileNamedAfterExport });
  });
});
