import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { updateProject } from '#src/features/update/lib/updateProject.ts';
import type { Renderer } from '#src/features/update/UpdateTypes.ts';
import type { BrutalwayState } from '#src/shared/stack/StackTypes.ts';

type Tree = Record<string, string>;

const V1: Tree = {
  'keep.txt': 'a\nb\nc\n',
  'deleted.txt': 'x\n',
  'old-name.txt': 'r1\nr2\nr3\nr4\nr5\n',
  'untouched.txt': 'same\n',
  'package.json':
    '{ "name": "app", "scripts": { "check": "lint" }, "dependencies": { "a": "1.0.0" } }\n',
};

const V2: Tree = {
  'keep.txt': 'a\nB from the template\nc\n',
  'deleted.txt': 'x2\n',
  'new-name.txt': 'r1\nr2\nr3\nr4\nr5\nr6\n',
  'untouched.txt': 'same\n',
  'added.txt': 'new\n',
  'package.json':
    '{ "name": "app", "scripts": { "check": "lint && secrets" }, "dependencies": { "a": "2.0.0" } }\n',
};

const TREES: Record<string, Tree> = { '1.0.0': V1, '2.0.0': V2 };

const FIRST: BrutalwayState = {
  schemaVersion: 1,
  createBrutal: '1.0.0',
  stack: 'fastify',
  projectName: 'app',
  options: {},
};

const SECOND: BrutalwayState = { ...FIRST, createBrutal: '2.0.0' };

function writeTree(dir: string, tree: Tree): void {
  for (const [file, content] of Object.entries(tree)) {
    mkdirSync(dirname(join(dir, file)), { recursive: true });
    writeFileSync(join(dir, file), content);
  }
}

async function render(target: BrutalwayState, dir: string): Promise<void> {
  writeTree(dir, TREES[target.createBrutal] ?? {});
  await Promise.resolve();
}

const fakeRender: Renderer = render;

function git(cwd: string, args: string[]): string {
  const result = spawnSync(
    'git',
    [
      '-c',
      'user.name=test',
      '-c',
      'user.email=test@localhost',
      '-c',
      'commit.gpgsign=false',
      ...args,
    ],
    { cwd, encoding: 'utf8' },
  );
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

function repoWith(tree: Tree, subdir = ''): { root: string; project: string } {
  const root = mkdtempSync(join(tmpdir(), 'create-brutal-update-test-'));
  const project = join(root, subdir);
  writeTree(project, tree);
  git(root, ['init', '--quiet']);
  git(root, ['add', '--all']);
  git(root, ['commit', '--quiet', '-m', 'init']);
  return { root, project };
}

function read(project: string, file: string): string {
  return readFileSync(join(project, file), 'utf8');
}

describe('updateProject', () => {
  it('merges the template changes into the edited project, with conflicts left to git', async () => {
    const { root, project } = repoWith({
      ...V1,
      'keep.txt': 'a\nB from the user\nc\n',
      'old-name.txt': 'r0\nr1\nr2\nr3\nr4\nr5\n',
      'package.json':
        '{ "name": "app", "scripts": { "check": "lint", "dev": "vite" }, "dependencies": { "a": "1.5.0" } }\n',
      'deleted.txt': '',
    });
    git(root, ['rm', '--quiet', 'deleted.txt']);
    git(root, ['commit', '--quiet', '-m', 'user edits']);
    const result = await updateProject({
      projectDir: project,
      from: FIRST,
      to: SECOND,
      render: fakeRender,
      attach: false,
    });
    assert.deepEqual(result, {
      conflicts: ['deleted.txt', 'keep.txt'],
      packageConflicts: ['dependencies.a'],
      attached: undefined,
    });
    assert.equal(read(project, 'new-name.txt'), 'r0\nr1\nr2\nr3\nr4\nr5\nr6\n');
    assert.equal(existsSync(join(project, 'old-name.txt')), false);
    assert.equal(read(project, 'added.txt'), 'new\n');
    assert.match(
      read(project, 'keep.txt'),
      /<<<<<<< [\s\S]*B from the user[\s\S]*B from the template/u,
    );
    assert.deepEqual(JSON.parse(read(project, 'package.json')), {
      name: 'app',
      scripts: { check: 'lint && secrets', dev: 'vite' },
      dependencies: { a: '1.5.0' },
    });
    assert.equal(JSON.parse(read(project, '.brutalway.json')).createBrutal, '2.0.0');
    assert.equal(existsSync(join(root, '.git', 'CHERRY_PICK_HEAD')), false);
  });

  it('updates a project that sits in a folder of its repository', async () => {
    const { project } = repoWith(V1, 'apps/api');
    const result = await updateProject({
      projectDir: project,
      from: FIRST,
      to: SECOND,
      render: fakeRender,
      attach: false,
    });
    assert.deepEqual(result.conflicts, []);
    assert.equal(read(project, 'keep.txt'), V2['keep.txt']);
    assert.equal(read(project, 'new-name.txt'), V2['new-name.txt']);
  });

  it('changes nothing but the state file when both versions generate the same project', async () => {
    const { root, project } = repoWith(V1);
    await updateProject({
      projectDir: project,
      from: FIRST,
      to: FIRST,
      render: fakeRender,
      attach: false,
    });
    assert.equal(git(root, ['status', '--porcelain']), '?? .brutalway.json\n');
  });

  it('refuses a working tree with changes', async () => {
    const { project } = repoWith(V1);
    writeFileSync(join(project, 'keep.txt'), 'edited\n');
    await assert.rejects(
      updateProject({
        projectDir: project,
        from: FIRST,
        to: SECOND,
        render: fakeRender,
        attach: false,
      }),
      /the working tree has changes/u,
    );
  });

  it('attaches a project made by the given version, and refuses one it did not make', async () => {
    const related = repoWith(V1);
    const result = await updateProject({
      projectDir: related.project,
      from: FIRST,
      to: SECOND,
      render: fakeRender,
      attach: true,
    });
    assert.deepEqual(result.attached, { total: 4, present: 4, identical: 4 });
    const unrelated = repoWith({ 'other.txt': 'x\n', 'package.json': '{}\n' });
    await assert.rejects(
      updateProject({
        projectDir: unrelated.project,
        from: FIRST,
        to: SECOND,
        render: fakeRender,
        attach: true,
      }),
      /only 0 of the 4 files that this version generates exist in the project/u,
    );
  });
});
