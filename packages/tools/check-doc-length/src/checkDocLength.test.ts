import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

const CLI = join(import.meta.dirname, 'checkDocLength.ts');
const GUIDE = '# Guide\n\nRead [usage](#usage).\n\n## Setup\n\nInstall it.\n\n### Notes\n\nFirst notes.\n\n## Usage\n\nRun it.\n';

function project(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'check-doc-length-'));
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

function run(cwd: string, args: string[] = []): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe('check-doc-length', () => {
  it('passes when every Markdown file is under the limit', () => {
    const root = project({ 'README.md': 'line\n'.repeat(300), 'docs/a.md': 'short\n' });
    assert.deepEqual(run(root), { status: 0, stdout: '', stderr: '' });
  });

  it('fails on each file above the limit, outside the ignored folders', () => {
    const root = project({
      'README.md': 'line\n'.repeat(301),
      'docs/b.md': 'line\n'.repeat(302),
      'CHANGELOG.md': 'line\n'.repeat(400),
      'node_modules/x/README.md': 'line\n'.repeat(400),
      'dist/x.md': 'line\n'.repeat(400),
    });
    assert.deepEqual(run(root), {
      status: 1,
      stdout: '',
      stderr: [
        'README.md has 301 lines, more than 300: run check-doc-length split README.md to see how it would be split along its headings, then add --write.',
        'docs/b.md has 302 lines, more than 300: run check-doc-length split docs/b.md to see how it would be split along its headings, then add --write.',
        '',
      ].join('\n'),
    });
  });

  it('reads the docLength settings of package.json, and a flag overrides them', () => {
    const root = project({
      'package.json': JSON.stringify({ docLength: { maxLines: 2, ignore: ['skipped/**'] } }),
      'a.md': 'line\n'.repeat(3),
      'skipped/b.md': 'line\n'.repeat(3),
    });
    assert.deepEqual(run(root), {
      status: 1,
      stdout: '',
      stderr: 'a.md has 3 lines, more than 2: run check-doc-length split a.md to see how it would be split along its headings, then add --write.\n',
    });
    assert.deepEqual(run(root, ['--max-lines', '3']), { status: 0, stdout: '', stderr: '' });
  });

  it('prints the files of a split without writing them', () => {
    const root = project({ 'docs/guide.md': GUIDE });
    assert.deepEqual(run(root, ['split', 'docs/guide.md']), {
      status: 0,
      stdout: 'docs/guide/README.md (6 lines)\ndocs/guide/setup.md (7 lines)\ndocs/guide/usage.md (3 lines)\n\nNothing written. Run it again with --write to replace docs/guide.md with these files.\n',
      stderr: '',
    });
    assert.equal(readFileSync(join(root, 'docs/guide.md'), 'utf8'), GUIDE);
    assert.equal(existsSync(join(root, 'docs/guide')), false);
  });

  it('writes the split with --write, removes the doc and rewrites the links into it', () => {
    const root = project({ 'docs/guide.md': GUIDE, 'README.md': 'See [usage](docs/guide.md#usage).\n' });
    assert.deepEqual(run(root, ['split', 'docs/guide.md', '--write']), {
      status: 0,
      stdout: 'docs/guide/README.md (6 lines)\ndocs/guide/setup.md (7 lines)\ndocs/guide/usage.md (3 lines)\nREADME.md (1 lines)\n',
      stderr: '',
    });
    assert.equal(existsSync(join(root, 'docs/guide.md')), false);
    assert.equal(readFileSync(join(root, 'docs/guide/README.md'), 'utf8'), '# Guide\n\nRead [usage](usage.md).\n\n- [Setup](setup.md)\n- [Usage](usage.md)\n');
    assert.equal(readFileSync(join(root, 'docs/guide/setup.md'), 'utf8'), '# Setup\n\nInstall it.\n\n## Notes\n\nFirst notes.\n');
    assert.equal(readFileSync(join(root, 'README.md'), 'utf8'), 'See [usage](docs/guide/usage.md).\n');
  });

  it('applies --file-depth, --order-prefix and --index-name to the split', () => {
    const root = project({ 'guide.md': GUIDE });
    assert.deepEqual(run(root, ['split', 'guide.md', '--file-depth', '3', '--order-prefix', '--index-name', 'index.md']), {
      status: 0,
      stdout:
        'guide/index.md (6 lines)\nguide/01-setup/index.md (5 lines)\nguide/01-setup/01-notes.md (3 lines)\nguide/02-usage.md (3 lines)\n\nNothing written. Run it again with --write to replace guide.md with these files.\n',
      stderr: '',
    });
  });

  it('fails on a split of a file that is not a Markdown file of the project', () => {
    const result = run(project({ 'a.md': '# A\n' }), ['split', 'missing.md']);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Error: missing\.md is not one of the Markdown files of this project/u);
  });
});
