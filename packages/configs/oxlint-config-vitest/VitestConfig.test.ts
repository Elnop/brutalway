import { deepStrictEqual } from 'node:assert';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutal/lint-utils/lintFixture';

test('vitestConfig checks test style and expectations', () => {
  deepStrictEqual(lintFixture(fileURLToPath(new URL('fixtures', import.meta.url))), [
    'cart.spec.ts:3 vitest(consistent-test-it)',
    'cart.spec.ts:8 vitest(consistent-test-it)',
    'cart.spec.ts:11 vitest(require-to-throw-message)',
    'cart.spec.ts:15 vitest(require-mock-type-parameters)',
    'cart.spec.ts:19 vitest(prefer-strict-equal)',
    'cart.spec.ts:20 vitest(prefer-strict-boolean-matchers)',
    'cart.spec.ts:21 vitest(prefer-called-times)',
  ]);
});
