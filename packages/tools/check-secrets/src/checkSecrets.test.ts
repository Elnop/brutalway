import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const CLI = join(import.meta.dirname, 'checkSecrets.ts');

function finding(file: string, line: number) {
  return {
    File: file,
    StartLine: line,
    RuleID: 'github-pat',
    Description: 'Uncovered a GitHub Personal Access Token',
    Fingerprint: `${file}:github-pat:${line}`,
  };
}

function fakeGitleaks(root: string, findings: object[]): string {
  const binary = join(root, 'fake-gitleaks');
  writeFileSync(
    binary,
    `#!/bin/sh\nfor last; do :; done\nprintf '%s' '${JSON.stringify(findings)}' > "$last"\n`,
  );
  chmodSync(binary, 0o755);
  return binary;
}

function run(root: string, binary: string): { status: number | null; lines: string[] } {
  const result = spawnSync(process.execPath, [CLI], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, GITLEAKS_BIN: binary },
  });
  return { status: result.status, lines: result.stderr.split('\n').filter((line) => line !== '') };
}

describe('check-secrets', () => {
  it('reports the secrets of the files git would commit, tracked or new, and leaves out the ignored ones', () => {
    const root = mkdtempSync(join(tmpdir(), 'check-secrets-'));
    spawnSync('git', ['init', '--quiet'], { cwd: root });
    writeFileSync(join(root, '.gitignore'), 'fake-gitleaks\n.env\n');
    for (const file of ['b.ts', 'a.ts', '.env']) writeFileSync(join(root, file), '');
    const binary = fakeGitleaks(root, [finding('b.ts', 1), finding('.env', 1), finding('a.ts', 3)]);
    assert.deepEqual(run(root, binary), {
      status: 1,
      lines: [
        'a.ts:3 github-pat: Uncovered a GitHub Personal Access Token. Remove it and revoke it, or, if it is public by design, add a.ts:github-pat:3 to .gitleaksignore',
        'b.ts:1 github-pat: Uncovered a GitHub Personal Access Token. Remove it and revoke it, or, if it is public by design, add b.ts:github-pat:1 to .gitleaksignore',
      ],
    });
  });

  it('passes when gitleaks finds nothing', () => {
    const root = mkdtempSync(join(tmpdir(), 'check-secrets-'));
    assert.deepEqual(run(root, fakeGitleaks(root, [])), { status: 0, lines: [] });
  });
});
