import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { pnpmCommands } from '#src/shared/stack/lib/pnpmCommands.ts';

describe('pnpmCommands', () => {
  it('rewrites the npm commands and leaves the word npm alone elsewhere', () => {
    assert.equal(
      pnpmCommands('Run `npm run check`, then `npm test`. Published on npm, with npm scripts.'),
      'Run `pnpm run check`, then `pnpm test`. Published on npm, with npm scripts.',
    );
    assert.equal(
      pnpmCommands('      - run: npm ci'),
      '      - run: pnpm install --frozen-lockfile',
    );
  });

  it('runs a dependency with pnpm exec and a pinned or one-off tool with pnpm dlx', () => {
    assert.equal(
      pnpmCommands('npx --no-install brutal-agent-hook --tree src && npx playwright install'),
      'pnpm exec brutal-agent-hook --tree src && pnpm exec playwright install',
    );
    assert.equal(
      pnpmCommands('npx create-brutal@latest update and npx eas-cli build'),
      'pnpm dlx create-brutal@latest update and pnpm dlx eas-cli build',
    );
  });

  it('sets pnpm up before Node in a workflow and caches its store', () => {
    assert.equal(
      pnpmCommands('      - uses: actions/setup-node@v7\n        with:\n          cache: npm\n'),
      '      - uses: pnpm/action-setup@v6\n      - uses: actions/setup-node@v7\n        with:\n          cache: pnpm\n',
    );
  });
});
