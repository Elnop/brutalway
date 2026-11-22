import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

const CLI = join(import.meta.dirname, 'checkExceptions.ts');

function write(root: string, files: Record<string, string>): void {
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), content);
  }
}

function git(root: string, args: string[]): void {
  spawnSync('git', ['-c', 'user.name=test', '-c', 'user.email=test@example.com', ...args], {
    cwd: root,
  });
}

function repository(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'check-exceptions-'));
  git(root, ['init', '--quiet', '--initial-branch=main']);
  write(root, files);
  git(root, ['add', '--all']);
  git(root, ['commit', '--quiet', '--message', 'start']);
  git(root, ['switch', '--quiet', '--create', 'change']);
  return root;
}

function alintEntry(rule: string, path: string): string {
  return JSON.stringify({ rule_id: rule, path, fingerprint: path, count: 1, message: '' });
}

function run(root: string, args: string[] = []): { status: number | null; lines: string[] } {
  const result = spawnSync(process.execPath, [CLI, ...args], { cwd: root, encoding: 'utf8' });
  return { status: result.status, lines: result.stderr.split('\n').filter((line) => line !== '') };
}

describe('check-exceptions', () => {
  it('passes when no list grew since the fork point, and when lists shrank', () => {
    const root = repository({
      'src/a.ts': '// oxlint-disable-next-line no-console\nconsole.log(1);\n// @ts-expect-error\n',
      'knip.json': '{ "ignoreDependencies": ["a", "b"] }',
    });
    write(root, {
      'src/a.ts': '// oxlint-disable-next-line no-console\nconsole.log(1);\n',
      'knip.json': '{ "ignoreDependencies": ["a"] }',
    });
    assert.deepEqual(run(root), { status: 0, lines: [] });
  });

  it('fails on a directive or a list entry added since the fork point, committed or not', () => {
    const root = repository({ 'src/a.ts': '', '.jscpd.json': '{ "ignore": ["**/*.test.ts"] }' });
    write(root, { 'src/a.ts': '// oxlint-disable-next-line no-console\n' });
    git(root, ['commit', '--quiet', '--all', '--message', 'escape']);
    write(root, { '.jscpd.json': '{ "ignore": ["**/*.test.ts", "src/legacy/**"] }' });
    const { status, lines } = run(root);
    assert.equal(status, 1);
    assert.match(
      lines[0] ?? '',
      /^jscpd ignore: 2 exceptions now, 1 at the fork point [0-9a-f]{7}: fix the code/u,
    );
    assert.match(
      lines[1] ?? '',
      /^oxlint-disable no-console: 1 exceptions now, 0 allowed for a new rule/u,
    );
  });

  it('counts the known violations of check-tree and dependency-cruiser per rule, so moving one is not growth', () => {
    const root = repository({
      '.check-tree-known-violations.json': JSON.stringify([
        { rule: 'shared-feature-groups', path: 'src/shared/ui', count: 3 },
      ]),
      '.dependency-cruiser-known-violations.json': JSON.stringify([
        { from: 'src/a.ts', to: 'src/b.ts', rule: { name: 'no-cross-feature' } },
      ]),
    });
    write(root, {
      '.check-tree-known-violations.json': JSON.stringify([
        { rule: 'shared-feature-groups', path: 'src/shared/ui', count: 2 },
        { rule: 'shared-feature-groups', path: 'src/shared/form', count: 1 },
      ]),
      '.dependency-cruiser-known-violations.json': JSON.stringify([
        { from: 'src/c.ts', to: 'src/b.ts', rule: { name: 'no-cross-feature' } },
        { from: 'src/c.ts', to: 'src/d.ts', rule: { name: 'no-circular' } },
      ]),
    });
    const { status, lines } = run(root);
    assert.equal(status, 1);
    assert.deepEqual(lines.length, 1);
    assert.match(lines[0] ?? '', /^dependency-cruiser no-circular: 1 exceptions now, 0 allowed/u);
  });

  it('counts the oxlint suppressions per rule, the sum of their counts over the files', () => {
    const root = repository({
      'oxlint-suppressions.json': JSON.stringify({
        'src/a.ts': { 'no-console': { count: 2 } },
      }),
    });
    write(root, {
      'oxlint-suppressions.json': JSON.stringify({
        'src/a.ts': { 'no-console': { count: 1 } },
        'src/b.ts': { 'no-console': { count: 1 }, 'typescript/no-explicit-any': { count: 1 } },
      }),
    });
    const { status, lines } = run(root);
    assert.equal(status, 1);
    assert.deepEqual(lines.length, 1);
    assert.match(
      lines[0] ?? '',
      /^oxlint-suppressions typescript\/no-explicit-any: 1 exceptions now, 0 allowed/u,
    );
  });

  it('counts the alint baseline per rule, the sum of the counts of its entries', () => {
    const header = JSON.stringify({ schema_version: 1, alint_version: '0.21.0' });
    const root = repository({
      '.alint-baseline.json': `${header}\n${alintEntry('styles-only-css', 'src/styles/a.ts')}\n`,
    });
    write(root, {
      '.alint-baseline.json': `${header}\n${alintEntry('styles-only-css', 'src/styles/b.ts')}\n${alintEntry('exact-dependency-versions', 'package.json')}\n`,
    });
    const { status, lines } = run(root);
    assert.equal(status, 1);
    assert.deepEqual(lines.length, 1);
    assert.match(lines[0] ?? '', /^alint exact-dependency-versions: 1 exceptions now, 0 allowed/u);
  });

  it('lets a first list land with "newRules", since an absent file counts 0 at the fork point', () => {
    const root = repository({ 'package.json': '{}' });
    write(root, {
      'package.json': JSON.stringify({
        'check-exceptions': { newRules: { 'gitleaks ignore': 2 } },
      }),
      '.gitleaksignore': 'app.config.js:generic-api-key:120\n.env.example:generic-api-key:20\n',
    });
    assert.deepEqual(run(root), { status: 0, lines: [] });
    write(root, { 'package.json': '{}' });
    const { status, lines } = run(root);
    assert.equal(status, 1);
    assert.match(lines[0] ?? '', /^gitleaks ignore: 2 exceptions now, 0 allowed for a new rule/u);
  });

  it('lets a new rule land with the number of exceptions "newRules" gives it', () => {
    const root = repository({ 'package.json': '{}' });
    write(root, {
      'package.json': JSON.stringify({
        'check-exceptions': { newRules: { 'check-tree single-consumer': 2 } },
      }),
      '.check-tree-known-violations.json': JSON.stringify([
        { rule: 'single-consumer', path: 'src/shared/a/a.ts' },
        { rule: 'single-consumer', path: 'src/shared/b/b.ts' },
      ]),
    });
    assert.deepEqual(run(root), { status: 0, lines: [] });
  });

  it('checks nothing outside a repository with a main branch, and stops on a --base that is not a commit', () => {
    const root = mkdtempSync(join(tmpdir(), 'check-exceptions-'));
    assert.deepEqual(run(root), {
      status: 0,
      lines: ['check-exceptions: no main branch to compare with, nothing checked.'],
    });
    rmSync(root, { recursive: true });
    const repo = repository({ 'src/a.ts': '' });
    assert.deepEqual(run(repo, ['--base', 'missing']), {
      status: 1,
      lines: ['check-exceptions: missing is not a commit of this repository'],
    });
  });
});
