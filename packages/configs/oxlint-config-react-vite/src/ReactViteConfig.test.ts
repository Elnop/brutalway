import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

describe('reactViteConfig', () => {
  it('reports each problem once and accepts Vite imports', () => {
    assert.deepEqual(lintFixture(fileURLToPath(new URL('../fixtures', import.meta.url))), [
      'src/limitConfig.spec.ts:5 vitest(prefer-strict-equal)',
      'src/limitConfig.spec.ts:5 vitest(prefer-to-be)',
      'src/Panel.tsx:4 eslint(no-restricted-imports)',
      'src/Panel.tsx:10 react-hooks(rules-of-hooks)',
      'src/shapes.ts:1 export-placement(no-restricted-syntax)',
      'src/shared-features/todos/TodosContainer.tsx:1 check-file(filename-blocklist)',
      'src/shared-features/todos/TodosContainer.tsx:1 component-roles(no-restricted-syntax)',
      'src/viewStore.ts:5 store-layout(store-layout)',
    ]);
  });
});
