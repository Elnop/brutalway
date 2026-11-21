import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { directiveCounts } from '#src/features/counts/lib/directiveCounts.ts';

describe('directiveCounts', () => {
  it('counts each rule a disable directive names, whatever its form, and the directives without a rule', () => {
    assert.deepEqual(
      directiveCounts([
        '// oxlint-disable-next-line max-lines-per-function, no-console -- legacy',
        '/* eslint-disable-line no-console',
        '// oxlint-disable',
        '// @ts-expect-error',
        '/* jscpd:ignore-start',
        '// gitleaks:allow',
      ]),
      [
        ['oxlint-disable max-lines-per-function', 1],
        ['oxlint-disable no-console', 1],
        ['eslint-disable no-console', 1],
        ['oxlint-disable (every rule)', 1],
        ['@ts-expect-error', 1],
        ['jscpd:ignore-start', 1],
        ['gitleaks:allow', 1],
      ],
    );
  });
});
