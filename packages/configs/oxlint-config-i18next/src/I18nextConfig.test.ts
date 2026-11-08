import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

describe('i18nextConfig', () => {
  it('reports visible text outside t(), in JSX, attributes and templates', () => {
    assert.deepEqual(lintFixture(fileURLToPath(new URL('../fixtures', import.meta.url))), [
      'Card.tsx:14 i18next(no-literal-string)',
      'Card.tsx:15 i18next(no-literal-string)',
      'Card.tsx:16 i18next(no-literal-string)',
      'Card.tsx:19 i18next(no-literal-string)',
      'Card.tsx:20 i18next(no-literal-string)',
      'Card.tsx:22 i18next(no-literal-string)',
    ]);
  });
});
