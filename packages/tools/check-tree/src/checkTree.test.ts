import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

const CLI = join(import.meta.dirname, 'checkTree.ts');

function project(
  files: string[],
  folders: string[] = [],
  sources: Record<string, string> = {},
): string {
  const root = mkdtempSync(join(tmpdir(), 'check-tree-'));
  writeFileSync(join(root, '.dependency-cruiser.cjs'), 'module.exports = {};');
  for (const folder of folders) mkdirSync(join(root, folder), { recursive: true });
  for (const file of files) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), sources[file] ?? '');
  }
  return root;
}

function run(
  cwd: string,
  args: string[] = [],
): { status: number | null; stdout: string; lines: string[] } {
  const result = spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });
  return {
    status: result.status,
    stdout: result.stdout,
    lines: result.stderr.split('\n').filter((line) => line !== ''),
  };
}

function textGroups(count: number): string {
  return project(
    [
      'src/features/a/A.ts',
      'src/features/b/B.ts',
      ...['textStore.ts', 'useText.ts', 'TextTypes.ts']
        .slice(0, count)
        .map((name) => `src/shared/text/${name}`),
    ],
    [],
    {
      'src/features/a/A.ts':
        "import '../../shared/text/textStore.ts'; import '../../shared/text/useText.ts'; import '../../shared/text/TextTypes.ts';",
      'src/features/b/B.ts':
        "import '../../shared/text/textStore.ts'; import '../../shared/text/useText.ts'; import '../../shared/text/TextTypes.ts';",
    },
  );
}

describe('check-tree', () => {
  it('prints nothing and exits with 0 on a conforming tree', () => {
    const root = project([
      'src/app/App.tsx',
      'src/features/feature/lib/a.ts',
      'src/features/feature/lib/b.ts',
      'src/features/feature/lib/a.test.ts',
      'src/features/feature/styles/a.css',
      'src/features/feature/styles/b.css',
    ]);
    assert.deepEqual(run(root, ['src']), { status: 0, stdout: '', lines: [] });
  });

  it('prints one line per problem and exits with 1', () => {
    const root = project(
      [
        'web/a.css',
        'web/b.css',
        'web/shared/text/lib/a.ts',
        'web/features/feature/cartTypes.ts',
        'web/features/feature/userTypes.ts',
        'web/shared/client.ts',
      ],
      ['web/features/empty'],
    );
    assert.deepEqual(run(root, ['web']), {
      status: 1,
      stdout: '',
      lines: [
        'web holds 2 styles files (a.css, b.css): move them into styles/',
        'web/features/empty is empty: delete it',
        'web/features/feature holds 2 types files (cartTypes.ts, userTypes.ts): move them into types/',
        'web/shared holds client.ts: shared/ holds one folder per shared feature, move each file into the shared feature of its concept',
        'web/shared/text/lib holds a single child: move it up one level and delete the folder',
      ],
    });
  });

  it('checks src when no folder is given', () => {
    const root = project(['src/shared/text/lib/a.ts']);
    assert.deepEqual(run(root), {
      status: 1,
      stdout: '',
      lines: [
        'src/shared/text/lib holds a single child: move it up one level and delete the folder',
      ],
    });
  });

  it('replaces the kind folders with --categories', () => {
    const root = project([
      'src/features/text/utils/b.ts',
      'src/features/text/hooks/useA.ts',
      'src/features/text/hooks/useB.ts',
    ]);
    assert.deepEqual(run(root, ['src', '--categories', 'utils, hooks']), {
      status: 1,
      stdout: '',
      lines: [
        'src/features/text/utils holds a single child: move it up one level and delete the folder',
      ],
    });
  });
  it('replaces the platforms of the variants with --platforms', () => {
    const root = project(['src/features/a/alert.ts', 'src/features/a/alert.tv.ts']);
    assert.deepEqual(run(root, ['src']), {
      status: 1,
      stdout: '',
      lines: ['src/features/a holds 2 lib files (alert.ts, alert.tv.ts): move them into lib/'],
    });
    assert.deepEqual(run(root, ['src', '--platforms', 'tv, web']), {
      status: 0,
      stdout: '',
      lines: [],
    });
  });

  it('reads its options from the "check-tree" key of package.json, and a flag wins over the key', () => {
    const root = project(
      [
        'package.json',
        'src/cli.ts',
        'src/plugin.ts',
        'src/features/a/alert.ts',
        'src/features/a/alert.tv.ts',
      ],
      [],
      {
        'package.json': JSON.stringify({ 'check-tree': { rootEntries: true, platforms: ['tv'] } }),
      },
    );
    assert.deepEqual(run(root, ['src']), { status: 0, stdout: '', lines: [] });
    assert.deepEqual(run(root, ['src', '--platforms', 'web']), {
      status: 1,
      stdout: '',
      lines: ['src/features/a holds 2 lib files (alert.ts, alert.tv.ts): move them into lib/'],
    });
  });

  it('stops with a message when the "check-tree" key of package.json is not a valid config', () => {
    const root = project(['package.json', 'src/app/App.tsx'], [], {
      'package.json': JSON.stringify({ 'check-tree': { rootEntries: 'yes' } }),
    });
    assert.deepEqual(run(root, ['src']), {
      status: 1,
      stdout: '',
      lines: [
        'the "check-tree" key of package.json holds an object with categories (a list of strings), rootEntries (a boolean) and platforms (a list of strings), all optional',
      ],
    });
  });

  it('with --root-entries, leaves the files at the root of the checked folder where they are and checks the rest', () => {
    const root = project([
      'src/cli.ts',
      'src/plugin.ts',
      'src/ReactConfig.ts',
      'src/HooksConfig.ts',
      'src/features/a/one.ts',
      'src/features/a/two.ts',
    ]);
    assert.deepEqual(run(root, ['src', '--root-entries']), {
      status: 1,
      stdout: '',
      lines: ['src/features/a holds 2 lib files (one.ts, two.ts): move them into lib/'],
    });
    assert.equal(run(root, ['src']).lines.length, 3);
  });

  it('reports a file of a shared feature that a single feature uses, and a shared feature whose files never import each other', () => {
    const root = project(
      [
        'src/features/a/A.ts',
        'src/features/b/B.ts',
        'src/shared/text/format.ts',
        'src/shared/text/TextTypes.ts',
        'src/shared/slugs/SlugTypes.ts',
      ],
      [],
      {
        'src/features/a/A.ts':
          "import '../../shared/text/format.ts';\nimport '../../shared/text/TextTypes.ts';\nimport '../../shared/slugs/SlugTypes.ts';",
        'src/features/b/B.ts': "import '../../shared/text/format.ts';",
      },
    );
    assert.deepEqual(run(root, ['src']), {
      status: 1,
      stdout: '',
      lines: [
        'src/shared/slugs/SlugTypes.ts is only used by src/features/a: move it into src/features/a',
        'src/shared/text/TextTypes.ts is only used by src/features/a: move it into src/features/a',
        'src/shared/text holds 2 groups of files that never import each other (format.ts) (TextTypes.ts): split it into one shared feature per group',
      ],
    });
  });

  it('with --write-known-violations, writes the rule, the path and the count of each violation and exits with 0', () => {
    const root = project(
      ['src/shared/text/lib/a.ts', 'src/shared/a.ts', 'src/shared/b.ts'],
      ['src/features/empty'],
    );
    assert.deepEqual(run(root, ['src', '--write-known-violations']), {
      status: 0,
      stdout: '',
      lines: [],
    });
    assert.deepEqual(
      JSON.parse(readFileSync(join(root, '.check-tree-known-violations.json'), 'utf8')),
      [
        { rule: 'empty-folder', path: 'src/features/empty' },
        { rule: 'shared-root-files', path: 'src/shared', count: 2 },
        { rule: 'single-child', path: 'src/shared/text/lib' },
      ],
    );
    assert.deepEqual(run(root, ['src']), { status: 0, stdout: '', lines: [] });
  });

  it('reports a violation missing from the known-violations file, and an entry that no longer happens', () => {
    const root = project(['src/shared/text/lib/a.ts'], ['src/features/empty']);
    writeFileSync(
      join(root, '.check-tree-known-violations.json'),
      JSON.stringify([
        { rule: 'empty-folder', path: 'src/features/empty' },
        { rule: 'empty-folder', path: 'src/features/gone' },
      ]),
    );
    assert.deepEqual(run(root, ['src']), {
      status: 1,
      stdout: '',
      lines: [
        'src/shared/text/lib holds a single child: move it up one level and delete the folder',
        '.check-tree-known-violations.json lists empty-folder for src/features/gone, which no longer happens: delete the entry or run check-tree with --shrink-known-violations',
      ],
    });
  });

  it('keeps a known violation known while its count does not grow, and reports it once the count is higher', () => {
    const known = JSON.stringify([
      { rule: 'shared-feature-groups', path: 'src/shared/text', count: 2 },
    ]);
    const fewer = textGroups(2);
    writeFileSync(join(fewer, '.check-tree-known-violations.json'), known);
    assert.deepEqual(run(fewer, ['src']), { status: 0, stdout: '', lines: [] });
    const more = textGroups(3);
    writeFileSync(join(more, '.check-tree-known-violations.json'), known);
    assert.deepEqual(run(more, ['src']), {
      status: 1,
      stdout: '',
      lines: [
        'src/shared/text holds 3 groups of files that never import each other (textStore.ts) (TextTypes.ts) (useText.ts): split it into one shared feature per group',
      ],
    });
  });

  it('reports an entry whose count is higher than the current one', () => {
    const root = textGroups(2);
    writeFileSync(
      join(root, '.check-tree-known-violations.json'),
      JSON.stringify([{ rule: 'shared-feature-groups', path: 'src/shared/text', count: 3 }]),
    );
    assert.deepEqual(run(root, ['src']), {
      status: 1,
      stdout: '',
      lines: [
        '.check-tree-known-violations.json lists shared-feature-groups for src/shared/text with a count of 3, which is now 2: lower it or run check-tree with --shrink-known-violations',
      ],
    });
  });

  it('with --shrink-known-violations, deletes the fixed entries, lowers the counts and leaves new violations out of the file', () => {
    const root = textGroups(2);
    mkdirSync(join(root, 'src/features/empty'));
    writeFileSync(
      join(root, '.check-tree-known-violations.json'),
      JSON.stringify([
        { rule: 'empty-folder', path: 'src/features/gone' },
        { rule: 'shared-feature-groups', path: 'src/shared/text', count: 3 },
      ]),
    );
    assert.deepEqual(run(root, ['src', '--shrink-known-violations']), {
      status: 1,
      stdout: '',
      lines: ['src/features/empty is empty: delete it'],
    });
    assert.deepEqual(
      JSON.parse(readFileSync(join(root, '.check-tree-known-violations.json'), 'utf8')),
      [{ rule: 'shared-feature-groups', path: 'src/shared/text', count: 2 }],
    );
  });

  it('refuses --write-known-violations and --shrink-known-violations together', () => {
    const root = project(['src/app/App.tsx']);
    assert.deepEqual(run(root, ['src', '--write-known-violations', '--shrink-known-violations']), {
      status: 1,
      stdout: '',
      lines: [
        'pass either --write-known-violations, which writes every current violation, or --shrink-known-violations, which only removes the fixed ones',
      ],
    });
  });

  it('stops with a message when the known-violations file is not a list of rules and paths', () => {
    const root = project(['src/app/App.tsx']);
    writeFileSync(
      join(root, '.check-tree-known-violations.json'),
      JSON.stringify(['src/features/empty is empty: delete it']),
    );
    assert.deepEqual(run(root, ['src']), {
      status: 1,
      stdout: '',
      lines: [
        '.check-tree-known-violations.json holds a JSON array of { "rule", "path", "count" } objects, count being optional: run check-tree with --write-known-violations to write it in this format',
      ],
    });
  });

  it('stops with a message when the folder has no dependency-cruiser config', () => {
    const root = project(['src/a.ts']);
    rmSync(join(root, '.dependency-cruiser.cjs'));
    assert.deepEqual(run(root, ['src']), {
      status: 1,
      stdout: '',
      lines: [
        'check-tree reads the dependency-cruiser config to resolve imports, and the current folder has none of .dependency-cruiser.js, .dependency-cruiser.cjs, .dependency-cruiser.mjs, .dependency-cruiser.json',
      ],
    });
  });
});
