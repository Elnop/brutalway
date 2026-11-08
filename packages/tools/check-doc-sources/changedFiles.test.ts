import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { changedFiles } from './changedFiles.ts';

function git(cwd: string, ...args: string[]): void {
  execFileSync('git', ['-c', 'user.name=test', '-c', 'user.email=test@example.com', ...args], { cwd, stdio: 'ignore' });
}

function repository(): string {
  const root = mkdtempSync(join(tmpdir(), 'doc-sources-git-'));
  mkdirSync(join(root, 'app/src'), { recursive: true });
  writeFileSync(join(root, 'app/src/edited.ts'), 'a\n');
  writeFileSync(join(root, 'app/src/spaces.ts'), 'a\n');
  writeFileSync(join(root, 'outside.ts'), 'a\n');
  git(root, 'init', '-q', '-b', 'main');
  git(root, 'add', '.');
  git(root, 'commit', '-q', '-m', 'first');
  return root;
}

test('files changed since HEAD, staged or not, and new files, relative to the folder it runs in', () => {
  const root = repository();
  writeFileSync(join(root, 'app/src/edited.ts'), 'b\n');
  writeFileSync(join(root, 'app/src/spaces.ts'), 'a  \n');
  writeFileSync(join(root, 'app/src/new.ts'), 'a\n');
  writeFileSync(join(root, 'outside.ts'), 'b\n');
  git(root, 'add', 'app/src/edited.ts');
  assert.deepEqual([...changedFiles(join(root, 'app'), undefined)].toSorted(), ['src/edited.ts', 'src/new.ts']);
});

test('with a base, the files changed since the commit the branch started from', () => {
  const root = repository();
  git(root, 'switch', '-q', '-c', 'feature');
  writeFileSync(join(root, 'app/src/edited.ts'), 'b\n');
  git(root, 'commit', '-q', '-am', 'second');
  assert.deepEqual([...changedFiles(join(root, 'app'), 'main')], ['src/edited.ts']);
});

test('a repository with no commit yet has nothing to compare, and is not an error', () => {
  const root = mkdtempSync(join(tmpdir(), 'doc-sources-git-'));
  git(root, 'init', '-q');
  writeFileSync(join(root, 'new.ts'), 'a\n');
  assert.deepEqual(changedFiles(root, undefined), new Set());
});

test('outside a git repository it throws, for the command to say so', () => {
  assert.throws(() => changedFiles(mkdtempSync(join(tmpdir(), 'doc-sources-none-')), undefined));
});
