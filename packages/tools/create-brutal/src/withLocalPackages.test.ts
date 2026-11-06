import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { withLocalPackages } from './withLocalPackages.ts';

describe('withLocalPackages', () => {
  it('points the local packages to their tarballs, directly and through overrides', () => {
    const manifest = JSON.stringify({
      name: 'app',
      dependencies: { react: '19.3.1' },
      devDependencies: { '@brutal/check-tree': '0.4.0', knip: '6.42.1' },
      overrides: { minimatch: '^11.0.1' },
    });
    const tarballs = new Map([
      ['@brutal/check-tree', '/tmp/brutal-check-tree-0.4.0.tgz'],
      ['@brutal/lint-utils', '/tmp/brutal-lint-utils-0.1.0.tgz'],
    ]);
    assert.deepEqual(JSON.parse(withLocalPackages(manifest, tarballs)), {
      name: 'app',
      dependencies: { react: '19.3.1' },
      devDependencies: { '@brutal/check-tree': 'file:/tmp/brutal-check-tree-0.4.0.tgz', knip: '6.42.1' },
      overrides: { minimatch: '^11.0.1', '@brutal/check-tree': 'file:/tmp/brutal-check-tree-0.4.0.tgz', '@brutal/lint-utils': 'file:/tmp/brutal-lint-utils-0.1.0.tgz' },
    });
  });

  it('rejects a manifest that is not an object', () => {
    assert.throws(() => withLocalPackages('[]', new Map()), { message: 'package.json is not an object' });
  });
});
