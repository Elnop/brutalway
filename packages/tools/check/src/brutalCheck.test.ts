import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const CLI = join(import.meta.dirname, 'brutalCheck.ts');

function project(scripts: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'brutal-check-'));
  writeFileSync(join(root, 'package.json'), JSON.stringify({ scripts }));
  return root;
}

function run(root: string, args: string[] = []): { status: number | null; lines: string[] } {
  const result = spawnSync(process.execPath, [CLI, ...args], { cwd: root, encoding: 'utf8' });
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

  it('stops with a message when the folder has no package.json', () => {
    const root = mkdtempSync(join(tmpdir(), 'brutal-check-'));
    const { status, lines } = run(root);
    assert.equal(status, 1);
    assert.match(lines[0] ?? '', /package\.json/u);
  });
});
