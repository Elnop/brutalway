import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildOrder } from './buildOrder.ts';

describe('buildOrder', () => {
  it('builds each workspace after the workspaces it depends on, whatever the dependency field', () => {
    const order = buildOrder([
      { name: 'react-vite', dependencies: { react: '^1.0.0', typescript: '^1.0.0' } },
      { name: 'react', dependencies: { typescript: '^1.0.0' } },
      { name: 'typescript', dependencies: { plugin: '^1.0.0' } },
      { name: 'plugin', devDependencies: { utils: '^1.0.0' } },
      { name: 'utils', peerDependencies: { oxlint: '^1.0.0' } },
    ]);
    assert.deepEqual(order, ['utils', 'plugin', 'typescript', 'react', 'react-vite']);
  });

  it('refuses a cycle and names it', () => {
    assert.throws(
      () =>
        buildOrder([
          { name: 'a', dependencies: { b: '1.0.0' } },
          { name: 'b', devDependencies: { a: '1.0.0' } },
        ]),
      /a -> b -> a/u,
    );
  });
});
