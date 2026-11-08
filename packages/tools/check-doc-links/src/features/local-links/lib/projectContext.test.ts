import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { githubRepository } from '#src/features/local-links/lib/projectContext.ts';

describe('githubRepository', () => {
  it('the repository is read from an https or ssh remote of GitHub', () => {
    assert.equal(githubRepository('https://github.com/Elnop/brutalway.git'), 'elnop/brutalway');
    assert.equal(githubRepository('git@github.com:Elnop/brutalway.git'), 'elnop/brutalway');
    assert.equal(githubRepository('https://gitlab.com/elnop/brutalway.git'), undefined);
  });
});
