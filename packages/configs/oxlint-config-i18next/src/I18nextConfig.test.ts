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
      'Card.tsx:21 i18next-attributes(no-restricted-syntax)',
      'Card.tsx:22 i18next(no-literal-string)',
      'Card.tsx:23 i18next(no-literal-string)',
      'Card.tsx:24 i18next(no-literal-string)',
      'Card.tsx:25 i18next(no-literal-string)',
      'Card.tsx:26 i18next(no-literal-string)',
      'Card.tsx:27 i18next-attributes(no-restricted-syntax)',
      'Card.tsx:28 i18next-attributes(no-restricted-syntax)',
      'Card.tsx:33 i18next(no-literal-string)',
    ]);
  });
});
