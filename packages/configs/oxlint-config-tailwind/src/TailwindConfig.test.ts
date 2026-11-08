import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

describe('tailwindConfig', () => {
  it('checks colors, fonts and dark variants', () => {
    assert.deepEqual(lintFixture(fileURLToPath(new URL('../fixtures', import.meta.url))), [
      'src/Badge.tsx:4 tailwind(color-tokens)',
      'src/Badge.tsx:5 tailwind(font-roles)',
      'src/Badge.tsx:6 tailwind(color-tokens)',
      'src/Badge.tsx:6 tailwind(color-tokens)',
      'src/Badge.tsx:6 tailwind(no-dark-variant)',
      'src/Badge.tsx:9 tailwind(color-tokens)',
    ]);
  });
});
