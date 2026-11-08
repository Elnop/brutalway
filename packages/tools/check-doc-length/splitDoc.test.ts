import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DEFAULT_SETTINGS } from './DocLengthConfig.ts';
import { splitDoc } from './splitDoc.ts';

const GUIDE = `---
title: Guide
---

# Guide

Read [setup](#setup), then [the second notes](#notes-1).

## Setup

Install it. See [usage](#usage) and [the readme](../README.md).

\`\`\`sh
# not a heading
npm install
\`\`\`

### Notes

First notes.

Usage
-----

Run it. Back to [setup](#setup).

### Notes

Second notes.
`;

function filesOf(plan: ReturnType<typeof splitDoc>): Record<string, string> {
  return Object.fromEntries(plan.written.map((file) => [file.path, file.content]));
}

describe('splitDoc', () => {
  it('cuts a doc along its level 2 headings and keeps everything else as written', () => {
    const files = filesOf(splitDoc('docs/guide.md', GUIDE, [], DEFAULT_SETTINGS));
    assert.deepEqual(Object.keys(files), ['docs/guide/README.md', 'docs/guide/setup.md', 'docs/guide/usage.md']);
    assert.equal(files['docs/guide/README.md'], '---\ntitle: Guide\n---\n\n# Guide\n\nRead [setup](setup.md), then [the second notes](usage.md#notes).\n\n- [Setup](setup.md)\n- [Usage](usage.md)\n');
    assert.equal(
      files['docs/guide/setup.md'],
      '# Setup\n\nInstall it. See [usage](usage.md) and [the readme](../../README.md).\n\n```sh\n# not a heading\nnpm install\n```\n\n## Notes\n\nFirst notes.\n',
    );
    assert.equal(files['docs/guide/usage.md'], 'Usage\n=====\n\nRun it. Back to [setup](setup.md).\n\n## Notes\n\nSecond notes.\n');
  });

  it('rewrites the links of other files that point into the split doc', () => {
    const plan = splitDoc(
      'docs/guide.md',
      GUIDE,
      [{ path: 'README.md', content: 'See [notes](docs/guide.md#notes-1), the [guide](docs/guide.md) and [elsewhere](docs/other.md).\n' }],
      DEFAULT_SETTINGS,
    );
    assert.equal(filesOf(plan)['README.md'], 'See [notes](docs/guide/usage.md#notes), the [guide](docs/guide/README.md) and [elsewhere](docs/other.md).\n');
  });

  it('turns level 2 headings into folders when files are cut at level 3, with order prefixes', () => {
    const files = filesOf(splitDoc('guide.md', GUIDE, [], { ...DEFAULT_SETTINGS, fileDepth: 3, orderPrefix: true }));
    assert.deepEqual(Object.keys(files), ['guide/README.md', 'guide/01-setup/README.md', 'guide/01-setup/01-notes.md', 'guide/02-usage/README.md', 'guide/02-usage/01-notes.md']);
    assert.equal(files['guide/01-setup/01-notes.md'], '# Notes\n\nFirst notes.\n');
    assert.match(files['guide/README.md'] ?? '', /\[the second notes\]\(02-usage\/01-notes\.md\)/u);
  });

  it('refuses a doc without level 2 headings', () => {
    assert.throws(() => splitDoc('notes.md', '# Notes\n\nShort.\n', [], DEFAULT_SETTINGS), { message: 'notes.md has no heading of depth 2 to split along' });
  });
});
