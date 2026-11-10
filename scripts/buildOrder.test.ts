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

  it('refuses a cycle of dependencies and names it', () => {
    assert.throws(
      () =>
        buildOrder([
          { name: 'a', dependencies: { b: '1.0.0' } },
          { name: 'b', peerDependencies: { a: '1.0.0' } },
        ]),
      /a -> b -> a/u,
    );
  });

  it('lets two packages check each other through devDependencies, since checks run once everything is built', () => {
    const order = buildOrder([
      { name: 'check-tree', devDependencies: { 'oxlint-config-node': '1.0.0' } },
      {
        name: 'oxlint-config-node',
        dependencies: { typescript: '1.0.0' },
        devDependencies: { 'check-tree': '1.0.0' },
      },
      { name: 'typescript' },
    ]);
    assert.ok(order.indexOf('typescript') < order.indexOf('oxlint-config-node'));
    assert.equal(order.length, 3);
  });
});
