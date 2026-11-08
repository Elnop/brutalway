import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

describe('shadcnConfig', () => {
  it('asks for the primitives and for lucide icons', () => {
    assert.deepEqual(lintFixture(fileURLToPath(new URL('../fixtures', import.meta.url))), [
      'Settings.tsx:1 ui-conventions(one-icon-library)',
      'Settings.tsx:3 ui-conventions(one-icon-library)',
      'Settings.tsx:12 ui-conventions(primitives-first)',
      'Settings.tsx:13 ui-conventions(primitives-first)',
      'Settings.tsx:14 ui-conventions(primitives-first)',
      'Settings.tsx:15 ui-conventions(primitives-first)',
    ]);
  });
});
