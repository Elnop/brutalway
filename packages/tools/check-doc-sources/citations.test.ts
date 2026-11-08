import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { citations } from './citations.ts';

function project(): string {
  const root = mkdtempSync(join(tmpdir(), 'doc-sources-'));
  mkdirSync(join(root, 'src/app'), { recursive: true });
  mkdirSync(join(root, 'docs'));
  writeFileSync(join(root, 'src/app/App.tsx'), '');
  writeFileSync(join(root, 'src/main.tsx'), '');
  writeFileSync(join(root, 'package.json'), '{}');
  return root;
}

test('files cited in inline code from the root and in links from the doc are found, with their line', () => {
  const root = project();
  const content = ['# Layout', '', '`src/app/App.tsx` composes the app.', '', 'It starts in [main](../src/main.tsx#L1), see `package.json`.', ''].join('\n');
  assert.deepEqual(citations(root, { path: 'docs/architecture.md', content }), [
    { doc: 'docs/architecture.md', file: 'src/app/App.tsx', line: 3 },
    { doc: 'docs/architecture.md', file: 'src/main.tsx', line: 5 },
    { doc: 'docs/architecture.md', file: 'package.json', line: 5 },
  ]);
});

test('folders, Markdown files, URLs, missing paths and code blocks are not citations', () => {
  const root = project();
  const content = ['`src/app/`, `README.md`, [site](https://example.com/src/main.tsx), `src/gone.ts`, `npm run check`', '', '```sh', 'cat src/main.tsx', '```', ''].join('\n');
  assert.deepEqual(citations(root, { path: 'README.md', content }), []);
});

test('inline code points to the nearest file, from the folder of the doc up to the root', () => {
  const root = project();
  mkdirSync(join(root, 'packages/tool'), { recursive: true });
  writeFileSync(join(root, 'packages/tool/package.json'), '{}');
  const content = '`package.json` and `src/main.tsx`\n';
  assert.deepEqual(citations(root, { path: 'packages/tool/README.md', content }), [
    { doc: 'packages/tool/README.md', file: 'packages/tool/package.json', line: 1 },
    { doc: 'packages/tool/README.md', file: 'src/main.tsx', line: 1 },
  ]);
});

test('a file cited twice in one doc counts once, at its first line', () => {
  const root = project();
  const content = '`src/main.tsx`\n\nAgain `src/main.tsx`.\n';
  assert.deepEqual(citations(root, { path: 'README.md', content }), [{ doc: 'README.md', file: 'src/main.tsx', line: 1 }]);
});
