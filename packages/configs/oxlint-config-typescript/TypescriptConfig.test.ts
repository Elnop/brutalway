import { deepStrictEqual } from 'node:assert';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

test('typescriptConfig reports each convention once', () => {
  deepStrictEqual(lintFixture(fileURLToPath(new URL('fixtures', import.meta.url))), [
    'area.ts:2 type-definitions(no-restricted-syntax)',
    'area.ts:6 eslint(func-style)',
    'area.ts:9 eslint(curly)',
    'area.ts:20 type-definitions(no-restricted-syntax)',
    'clamp.ts:1 typescript(method-signature-style)',
    'clamp.ts:4 eslint(no-param-reassign)',
    'clamp.ts:5 unicorn(no-array-for-each)',
    'clamp.ts:6 eslint(no-nested-ternary)',
    'clamp.ts:6 eslint(require-unicode-regexp)',
    'formatPrice.ts:1 file-named-after-export(file-named-after-export)',
    'helpers.ts:3 export-placement(no-restricted-syntax)',
    'helpers.ts:4 export-placement(no-restricted-syntax)',
    'helpers.ts:5 export-placement(no-restricted-syntax)',
    'helpers.ts:18 no-comments(disallowComments)',
    'index.ts:1 check-file(no-index)',
    'shapeConfig.ts:2 export-placement(no-restricted-syntax)',
    'ShapeConfig.tsx:1 check-file(filename-blocklist)',
    'ShapeConfig.tsx:1 export-placement(no-restricted-syntax)',
    'shapeTypes.ts:2 export-placement(no-restricted-syntax)',
    'shared-features/todos/todosRoutes.ts:1 check-file(filename-blocklist)',
    'types.ts:1 check-file(filename-blocklist)',
    'types.ts:1 export-placement(no-restricted-syntax)',
    'types.ts:2 export-placement(no-restricted-syntax)',
  ]);
});
