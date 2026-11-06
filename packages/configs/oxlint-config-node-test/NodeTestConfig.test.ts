import { deepStrictEqual } from 'node:assert';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutal/lint-utils/lintFixture';

test('nodeTestConfig wants it() inside describe() and node:assert/strict', () => {
  deepStrictEqual(lintFixture(fileURLToPath(new URL('fixtures', import.meta.url))), [
    'bad.test.ts:1 node-test(no-restricted-syntax)',
    'bad.test.ts:2 node-test(no-restricted-syntax)',
    'bad.test.ts:8 node-test(no-restricted-syntax)',
  ]);
});
