import assert from 'node:assert/strict';
import { test } from 'node:test';
import { unreleased } from './unreleased.ts';

const manifests = [
  {
    folder: 'packages/tools/check-tree',
    name: '@brutalway/check-tree',
    version: '0.12.0',
    private: false,
  },
  {
    folder: 'packages/tools/agent-hook',
    name: '@brutalway/agent-hook',
    version: '0.4.0',
    private: false,
  },
  { folder: 'packages/tools/internal', name: 'internal', version: '1.0.0', private: true },
  { folder: 'templates/vite', name: 'template-vite', version: '0.10.5', private: true },
  { folder: 'templates/next', name: 'template-next', version: '0.7.4', private: true },
];

test('a package or a template whose version has no tag is released, a private package never is', () => {
  const tags = new Set(['@brutalway/agent-hook@0.4.0', 'template-next@0.7.4']);
  assert.deepEqual(
    unreleased(manifests, tags).map(({ name }) => name),
    ['@brutalway/check-tree', 'template-vite'],
  );
});

test('nothing is released when every version has its tag', () => {
  const tags = new Set(manifests.map(({ name, version }) => `${name}@${version}`));
  assert.deepEqual(unreleased(manifests, tags), []);
});
