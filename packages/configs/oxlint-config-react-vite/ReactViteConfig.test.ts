import { deepStrictEqual } from 'node:assert';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

test('reactViteConfig reports each problem once and accepts Vite imports', () => {
  deepStrictEqual(lintFixture(fileURLToPath(new URL('fixtures', import.meta.url))), [
    'src/Panel.tsx:4 eslint(no-restricted-imports)',
    'src/Panel.tsx:10 react-hooks(rules-of-hooks)',
    'src/shapes.ts:1 export-placement(no-restricted-syntax)',
    'src/shared-features/todos/TodosContainer.tsx:1 check-file(filename-blocklist)',
    'src/viewStore.ts:5 store-layout(store-layout)',
  ]);
});
