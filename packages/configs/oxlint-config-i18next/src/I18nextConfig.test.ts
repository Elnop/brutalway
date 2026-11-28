import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

const FIXTURES = fileURLToPath(new URL('../fixtures', import.meta.url));

function hitsIn(file: string): string[] {
  return lintFixture(FIXTURES).filter((hit) => hit.startsWith(`${file}:`));
}

describe('i18nextConfig', () => {
  it('reports visible text outside t(), in JSX, attributes and templates', () => {
    assert.deepEqual(hitsIn('Card.tsx'), [
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

  it('reports the text of a submit button and the aria attributes a screen reader speaks', () => {
    const attribute = 'i18next-attributes(no-restricted-syntax)';
    const literal = 'i18next(no-literal-string)';
    assert.deepEqual(hitsIn('Native.tsx'), [
      ...[8, 9, 10, 11, 12, 13, 14, 15, 16].map((line) => `Native.tsx:${line} ${attribute}`),
      ...[17, 18, 19].map((line) => `Native.tsx:${line} ${literal}`),
    ]);
  });

  it('reports a literal handed to toast, alert, confirm or document.title', () => {
    const call = 'i18next-attributes(no-restricted-syntax)';
    assert.deepEqual(
      hitsIn('calls.ts'),
      [9, 10, 11, 12, 13, 14, 15, 16].map((line) => `calls.ts:${line} ${call}`),
    );
  });

  it('leaves alone what is not text a user reads', () => {
    assert.deepEqual(hitsIn('Allowed.tsx'), []);
  });
});
