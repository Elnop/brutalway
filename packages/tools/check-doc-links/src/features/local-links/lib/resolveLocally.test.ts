import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import type { ProjectContext } from '#src/features/local-links/LocalLinksTypes.ts';
import { resolveLocally } from '#src/features/local-links/lib/resolveLocally.ts';

function context(): ProjectContext {
  const gitRoot = mkdtempSync(join(tmpdir(), 'doc-links-'));
  mkdirSync(join(gitRoot, 'docs'));
  writeFileSync(join(gitRoot, 'docs/new.md'), '');
  return { gitRoot, repository: 'elnop/brutalway', packages: new Set(['@brutalway/check-tree']) };
}

describe('resolveLocally', () => {
  it('a link to a file of this repository on main is checked on disk, so a file added in the same commit passes', () => {
    assert.equal(resolveLocally('https://github.com/Elnop/brutalway/blob/main/docs/new.md#usage', context())?.verdict, 'alive');
    assert.deepEqual(resolveLocally('https://github.com/Elnop/brutalway/tree/main/docs/gone', context()), { verdict: 'dead', reason: 'no docs/gone in this repository' });
  });

  it('the npm page of a package of this project is not requested, since it may not be published yet', () => {
    assert.equal(resolveLocally('https://www.npmjs.com/package/@brutalway/check-tree', context())?.verdict, 'alive');
    assert.equal(resolveLocally('https://www.npmjs.com/package/react', context()), undefined);
  });

  it('another repository, another branch and other sites go to the network', () => {
    assert.equal(resolveLocally('https://github.com/JCluzet/bedrock/blob/main/README.md', context()), undefined);
    assert.equal(resolveLocally('https://github.com/Elnop/brutalway/blob/v1.0.0/docs/new.md', context()), undefined);
    assert.equal(resolveLocally('https://martinfowler.com/', context()), undefined);
  });
});
