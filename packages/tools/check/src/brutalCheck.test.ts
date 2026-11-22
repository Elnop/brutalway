import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { describe, it } from 'node:test';

const CLI = join(import.meta.dirname, 'brutalCheck.ts');

function project(manifest: object, tools: Record<string, number> = {}): string {
  const root = mkdtempSync(join(tmpdir(), 'brutal-check-'));
  writeFileSync(join(root, 'package.json'), JSON.stringify(manifest));
  const bin = join(root, 'bin');
  mkdirSync(bin);
  for (const [tool, status] of Object.entries(tools)) {
    writeFileSync(join(bin, tool), `#!/bin/sh\necho "${tool} $*"\nexit ${String(status)}\n`);
    chmodSync(join(bin, tool), 0o755);
  }
  return root;
}

function run(root: string): { status: number | null; lines: string[] } {
  const result = spawnSync(process.execPath, [CLI], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, PATH: `${join(root, 'bin')}${delimiter}${process.env['PATH'] ?? ''}` },
  });
  return {
    status: result.status,
    lines: (result.stdout || result.stderr).split('\n').filter((line) => line !== ''),
  };
}

describe('brutal-check', () => {
  it('runs the scripts and the tools the project has, in order, and skips the others', () => {
    const root = project(
      {
        scripts: { lint: 'echo linted', typecheck: 'echo typed' },
        devDependencies: { knip: '6.0.0' },
      },
      { knip: 0 },
    );
    assert.deepEqual(run(root), {
      status: 0,
      lines: [
        'brutal-check: typecheck',
        'typed',
        'brutal-check: lint',
        'linted',
        'brutal-check: knip',
        'knip ',
        'brutal-check: knip --production',
        'knip --production',
        'brutal-check: skipped prettier (no prettier), styles (no "styles" script), deps (no "deps" script), tree (no "tree" script), duplicates (no "duplicates" script), docs (no "docs" script), messages (no "messages" script), alint (no @asamarts/alint), check-secrets (no @brutalway/check-secrets), check-exceptions (no @brutalway/check-exceptions)',
        'brutal-check: every check passed',
      ],
    });
  });

  it('runs every step after a failure and names the steps that failed', () => {
    const root = project(
      {
        scripts: { typecheck: 'exit 2', tree: 'echo tree' },
        devDependencies: { '@brutalway/check-exceptions': '0.2.0' },
      },
      { 'check-exceptions': 1 },
    );
    const { status, lines } = run(root);
    assert.equal(status, 1);
    assert.ok(lines.includes('tree'));
    assert.equal(lines.at(-1), 'brutal-check: typecheck, check-exceptions failed');
  });

  it('stops with a message when the folder has no package.json', () => {
    const root = mkdtempSync(join(tmpdir(), 'brutal-check-'));
    const { status, lines } = run(root);
    assert.equal(status, 1);
    assert.match(lines[0] ?? '', /package\.json/u);
  });
});
