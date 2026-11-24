import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const CLI = join(import.meta.dirname, 'brutalCheck.ts');

function project(scripts: Record<string, string>, fields: Record<string, string> = {}): string {
  const root = mkdtempSync(join(tmpdir(), 'brutal-check-'));
  writeFileSync(join(root, 'package.json'), JSON.stringify({ scripts, ...fields }));
  return root;
}

function fakePnpmPath(): string {
  const bin = join(mkdtempSync(join(tmpdir(), 'brutal-check-bin-')), 'bin');
  mkdirSync(bin);
  writeFileSync(join(bin, 'pnpm'), '#!/bin/sh\necho "pnpm $*"\nexit 1\n');
  chmodSync(join(bin, 'pnpm'), 0o755);
  return `${bin}:${process.env['PATH'] ?? ''}`;
}

function run(
  root: string,
  args: string[] = [],
  env: NodeJS.ProcessEnv = process.env,
): { status: number | null; lines: string[] } {
  const result = spawnSync(process.execPath, [CLI, ...args], { cwd: root, encoding: 'utf8', env });
  return {
    status: result.status,
    lines: (result.stdout || result.stderr)
      .split('\n')
      .filter((line) => line !== '')
      .map((line) => line.replace(/\(\d+\.\ds\)/u, '(s)')),
  };
}

describe('brutal-check', () => {
  it('with --serial, runs the scripts the project has in its order and names the missing ones', () => {
    const root = project({ unused: 'echo unused', lint: 'echo linted', typecheck: 'echo typed' });
    assert.deepEqual(run(root, ['--serial']), {
      status: 0,
      lines: [
        'brutal-check: no script for format:check, styles, deps, tree, duplicates, docs, messages, repo, secrets, exceptions',
        'brutal-check: typecheck OK (s)',
        'brutal-check: lint OK (s)',
        'brutal-check: unused OK (s)',
        'brutal-check: every check passed',
      ],
    });
  });

  it('runs the steps at the same time, prints the output of a failed one and names the failures', () => {
    const root = project({
      typecheck: 'echo "src/a.ts: type error" && exit 2',
      tree: 'echo tree',
      exceptions: 'exit 1',
    });
    const { status, lines } = run(root);
    assert.equal(status, 1);
    assert.ok(lines.includes('brutal-check: tree OK (s)'));
    assert.ok(!lines.includes('tree'));
    assert.ok(lines.includes('brutal-check: typecheck FAILED (s)'));
    assert.ok(lines.includes('src/a.ts: type error'));
    assert.equal(lines.at(-1), 'brutal-check: typecheck, exceptions failed');
  });

  it('runs the scripts with the package manager that started it, read from npm_config_user_agent', () => {
    const root = project({ lint: 'echo linted' }, { packageManager: 'npm@11.0.0' });
    const env = {
      PATH: fakePnpmPath(),
      npm_config_user_agent: 'pnpm/10.20.0 npm/? node/v26.0.0 linux x64',
    };
    assert.ok(run(root, ['--serial'], env).lines.includes('pnpm --silent run lint'));
  });

  it('falls back on the packageManager field of package.json, then on npm', () => {
    const pnpmProject = project({ lint: 'echo linted' }, { packageManager: 'pnpm@10.20.0' });
    const env = { PATH: fakePnpmPath() };
    assert.ok(run(pnpmProject, ['--serial'], env).lines.includes('pnpm --silent run lint'));
    const plainProject = project({ lint: 'echo linted' });
    assert.ok(run(plainProject, ['--serial'], env).lines.includes('brutal-check: lint OK (s)'));
  });

  it('stops with a message when the folder has no package.json', () => {
    const root = mkdtempSync(join(tmpdir(), 'brutal-check-'));
    const { status, lines } = run(root);
    assert.equal(status, 1);
    assert.match(lines[0] ?? '', /package\.json/u);
  });
});
