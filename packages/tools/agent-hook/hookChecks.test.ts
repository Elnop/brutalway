import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { hookChecks } from './hookChecks.ts';

function project(files: string[]): string {
  const root = mkdtempSync(join(tmpdir(), 'hook-'));
  for (const file of files) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), '');
  }
  return root;
}

test('an edited TypeScript file is linted from the root config', () => {
  const root = project(['oxlint.config.ts', 'src/a.ts']);
  assert.deepEqual(hookChecks(root, { file: join(root, 'src/a.ts'), created: false }, ['src']), [
    { label: 'oxlint found problems in src/a.ts', command: 'oxlint', args: ['--type-aware', 'src/a.ts'], cwd: root },
  ]);
});

test('a file under a workspace is linted from the nearest oxlint config', () => {
  const root = project(['oxlint.config.ts', 'web/oxlint.config.ts', 'web/src/a.tsx']);
  const [oxlint] = hookChecks(root, { file: join(root, 'web/src/a.tsx'), created: false }, []);
  assert.deepEqual(oxlint, { label: 'oxlint found problems in web/src/a.tsx', command: 'oxlint', args: ['--type-aware', 'src/a.tsx'], cwd: join(root, 'web') });
});

test('a created file also runs alint and check-tree on the tree that holds it', () => {
  const root = project(['oxlint.config.ts', '.alint.yml', 'web/src/a.ts']);
  const checks = hookChecks(root, { file: join(root, 'web/src/a.ts'), created: true }, ['web/src', 'src']);
  assert.deepEqual(
    checks.map((check) => [check.command, ...check.args]),
    [
      ['oxlint', '--type-aware', 'web/src/a.ts'],
      ['alint', 'check'],
      ['check-tree', 'web/src'],
    ],
  );
});

test('an edited Markdown file runs alint only, and only when the project has a config', () => {
  const withAlint = project(['.alint.yml', 'docs/a.md']);
  assert.deepEqual(
    hookChecks(withAlint, { file: join(withAlint, 'docs/a.md'), created: false }, ['src']).map((check) => check.command),
    ['alint'],
  );
  const withoutAlint = project(['docs/a.md']);
  assert.deepEqual(hookChecks(withoutAlint, { file: join(withoutAlint, 'docs/a.md'), created: false }, ['src']), []);
});

test('files outside the project or in node_modules are ignored', () => {
  const root = project(['oxlint.config.ts']);
  assert.deepEqual(hookChecks(root, { file: '/elsewhere/a.ts', created: true }, ['src']), []);
  assert.deepEqual(hookChecks(root, { file: join(root, 'node_modules/x/a.ts'), created: true }, ['src']), []);
  assert.deepEqual(hookChecks(root, { file: '', created: true }, ['src']), []);
});
