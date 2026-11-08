import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { vendoredFolder } from '#src/shared-features/vendored/vendoredFolder.ts';

describe('vendoredFolder', () => {
  it('gives the vendored folder that holds the path, trailing slashes removed', () => {
    assert.equal(vendoredFolder('third-party/shadcn/button.tsx', ['third-party']), 'third-party');
    assert.equal(vendoredFolder('vendor/a.ts', ['third-party', 'vendor//']), 'vendor');
  });

  it('gives nothing for a path outside the vendored folders', () => {
    assert.equal(vendoredFolder('third-party-notes.md', ['third-party']), undefined);
    assert.equal(vendoredFolder('src/a.ts', ['third-party']), undefined);
    assert.equal(vendoredFolder('third-party/shadcn/button.tsx', []), undefined);
  });
});
