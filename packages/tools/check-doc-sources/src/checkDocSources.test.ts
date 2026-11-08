import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

const CLI = join(import.meta.dirname, 'checkDocSources.ts');

function write(root: string, files: Record<string, string>): void {
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
}

function git(cwd: string, ...args: string[]): void {
  execFileSync('git', ['-c', 'user.name=test', '-c', 'user.email=test@example.com', ...args], { cwd, stdio: 'ignore' });
}

function repository(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'check-doc-sources-'));
  write(root, files);
  git(root, 'init', '-q', '-b', 'main');
  git(root, 'add', '.');
  git(root, 'commit', '-q', '-m', 'first');
  return root;
}

function run(cwd: string, args: string[] = []): { status: number | null; stdout: string; lines: string[] } {
  const result = spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, lines: result.stderr.split('\n').filter((line) => line !== '') };
}

const PROJECT = {
  'src/app.ts': 'a\n',
  'src/main.ts': 'a\n',
  'package.json': '{}\n',
  'README.md': '# App\n\n`src/app.ts` starts it, see `package.json`.\n',
  'docs/guide.md': 'Read [main](../src/main.ts#L1).\n\nAnd `src/app.ts`.\n',
};

describe('check-doc-sources', () => {
  it('warns on each changed file cited by a doc that did not change, and exits with 0', () => {
    const root = repository(PROJECT);
    write(root, { 'src/app.ts': 'b\n', 'src/main.ts': 'b\n', 'package.json': '{ "name": "app" }\n' });
    assert.deepEqual(run(root), {
      status: 0,
      stdout: '',
      lines: [
        'src/app.ts changed, and README.md:3 cites it but did not change: check that what it says about it still holds.',
        'src/main.ts changed, and docs/guide.md:1 cites it but did not change: check that what it says about it still holds.',
        'src/app.ts changed, and docs/guide.md:3 cites it but did not change: check that what it says about it still holds.',
      ],
    });
  });

  it('says nothing when the doc changed with the file, or when only whitespace changed', () => {
    const root = repository(PROJECT);
    write(root, { 'src/app.ts': 'b\n', 'README.md': '# App\n\n`src/app.ts` starts it.\n', 'docs/guide.md': 'Read [main](../src/main.ts#L1).\n\nAnd `src/app.ts`, again.\n', 'src/main.ts': 'a  \n' });
    assert.deepEqual(run(root), { status: 0, stdout: '', lines: [] });
  });

  it('reads the docSources settings of package.json', () => {
    const root = repository({ ...PROJECT, 'package.json': JSON.stringify({ docSources: { ignore: ['docs/**'], ignoreSources: [] } }) });
    write(root, { 'src/main.ts': 'b\n', 'package.json': JSON.stringify({ name: 'app', docSources: { ignore: ['docs/**'], ignoreSources: [] } }) });
    assert.deepEqual(run(root), {
      status: 0,
      stdout: '',
      lines: ['package.json changed, and README.md:3 cites it but did not change: check that what it says about it still holds.'],
    });
  });

  it('compares with the commit the branch started from with --base, from a subfolder', () => {
    const root = repository({ 'app/src/app.ts': 'a\n', 'app/README.md': '`src/app.ts`\n' });
    git(root, 'switch', '-q', '-c', 'feature');
    write(root, { 'app/src/app.ts': 'b\n' });
    git(root, 'commit', '-q', '-am', 'second');
    const cwd = join(root, 'app');
    assert.deepEqual(run(cwd), { status: 0, stdout: '', lines: [] });
    assert.deepEqual(run(cwd, ['--base', 'main']), {
      status: 0,
      stdout: '',
      lines: ['src/app.ts changed, and README.md:1 cites it but did not change: check that what it says about it still holds.'],
    });
  });

  it('checks nothing before the first commit', () => {
    const root = mkdtempSync(join(tmpdir(), 'check-doc-sources-'));
    write(root, PROJECT);
    git(root, 'init', '-q');
    assert.deepEqual(run(root), { status: 0, stdout: '', lines: [] });
  });

  it('says it has nothing to compare with outside a git repository or with an unknown base', () => {
    const outside = mkdtempSync(join(tmpdir(), 'check-doc-sources-'));
    write(outside, PROJECT);
    assert.deepEqual(run(outside), { status: 0, stdout: '', lines: ['check-doc-sources: no git history to compare with, nothing checked.'] });
    assert.deepEqual(run(repository(PROJECT), ['--base', 'nowhere']), {
      status: 0,
      stdout: '',
      lines: ['check-doc-sources: no git history to compare with nowhere, nothing checked.'],
    });
  });
});
