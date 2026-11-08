import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

const CLI = join(import.meta.dirname, 'checkTree.ts');

function project(files: string[], folders: string[] = []): string {
  const root = mkdtempSync(join(tmpdir(), 'check-tree-'));
  for (const folder of folders) mkdirSync(join(root, folder), { recursive: true });
  for (const file of files) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), '');
  }
  return root;
}

function run(cwd: string, args: string[] = []): { status: number | null; stdout: string; lines: string[] } {
  const result = spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, lines: result.stderr.split('\n').filter((line) => line !== '') };
}

describe('check-tree', () => {
  it('prints nothing and exits with 0 on a conforming tree', () => {
    const root = project(['src/app/App.tsx', 'src/lib/a.ts', 'src/lib/b.ts', 'src/lib/a.test.ts', 'src/feature/styles/a.css', 'src/feature/styles/b.css']);
    assert.deepEqual(run(root, ['src']), { status: 0, stdout: '', lines: [] });
  });

  it('prints one line per problem and exits with 1', () => {
    const root = project(['web/a.css', 'web/b.css', 'web/lib/a.ts', 'web/feature/cartTypes.ts', 'web/feature/userTypes.ts'], ['web/empty']);
    assert.deepEqual(run(root, ['web']), {
      status: 1,
      stdout: '',
      lines: [
        'web holds 2 styles files (a.css, b.css): move them into styles/',
        'web/empty is empty: delete it',
        'web/feature holds 2 types files (cartTypes.ts, userTypes.ts): move them into types/',
        'web/lib holds a single child: move it up one level and delete the folder',
      ],
    });
  });

  it('checks src when no folder is given', () => {
    const root = project(['src/lib/a.ts']);
    assert.deepEqual(run(root), { status: 1, stdout: '', lines: ['src/lib holds a single child: move it up one level and delete the folder'] });
  });

  it('replaces the category folders with --categories', () => {
    const root = project(['src/lib/a.ts', 'src/utils/b.ts', 'src/hooks/useA.ts', 'src/hooks/useB.ts']);
    assert.deepEqual(run(root, ['src', '--categories', 'utils, hooks']), {
      status: 1,
      stdout: '',
      lines: ['src/utils holds a single child: move it up one level and delete the folder'],
    });
  });
  it('with --root-entries, leaves the files at the root of the checked folder where they are and checks the rest', () => {
    const root = project(['src/cli.ts', 'src/plugin.ts', 'src/ReactConfig.ts', 'src/HooksConfig.ts', 'src/features/a/one.ts', 'src/features/a/two.ts']);
    assert.deepEqual(run(root, ['src', '--root-entries']), { status: 1, stdout: '', lines: ['src/features/a holds 2 lib files (one.ts, two.ts): move them into lib/'] });
    assert.equal(run(root, ['src']).lines.length, 3);
  });
});
