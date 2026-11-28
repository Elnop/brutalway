import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

describe('lineWidthConfig', () => {
  it('reports a line over 100 columns whatever it holds, and a string cut into pieces, in every form', () => {
    assert.deepEqual(
      lintFixture(fileURLToPath(new URL('../fixtures/line-width', import.meta.url))),
      [
        'imports.ts:1 line-width(max-len)',
        'split.ts:2 eslint(no-multi-str)',
        'split.ts:4 eslint(no-useless-concat)',
        'split.ts:4 line-width(no-restricted-syntax)',
        'split.ts:6 line-width(no-restricted-syntax)',
        'split.ts:8 eslint(prefer-template)',
        'split.ts:8 line-width(no-restricted-syntax)',
        'split.ts:10 line-width(no-restricted-syntax)',
        'split.ts:12 eslint(prefer-template)',
        'split.ts:13 line-width(no-restricted-syntax)',
        'split.ts:15 eslint(no-useless-concat)',
        'split.ts:15 eslint(no-useless-concat)',
        'split.ts:15 line-width(no-restricted-syntax)',
        'split.ts:15 line-width(no-restricted-syntax)',
        'width.ts:2 line-width(max-len)',
        'width.ts:3 line-width(max-len)',
        'width.ts:4 line-width(max-len)',
        'width.ts:5 line-width(max-len)',
      ],
    );
  });
});
