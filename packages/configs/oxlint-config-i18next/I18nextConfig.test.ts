import { deepStrictEqual } from 'node:assert';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

test('i18nextConfig reports visible text outside t(), in JSX, attributes and templates', () => {
  deepStrictEqual(lintFixture(fileURLToPath(new URL('fixtures', import.meta.url))), [
    'Card.tsx:14 i18next(no-literal-string)',
    'Card.tsx:15 i18next(no-literal-string)',
    'Card.tsx:16 i18next(no-literal-string)',
    'Card.tsx:19 i18next(no-literal-string)',
  ]);
});
