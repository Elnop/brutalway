import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Finding } from '#src/features/findings/FindingsTypes.ts';

const ARGUMENTS = ['dir', '.', '--no-banner', '--redact', '--log-level', 'error'];
const REPORT = ['--exit-code', '0', '--report-format', 'json', '--report-path'];

function isFinding(value: unknown): value is Finding {
  return typeof value === 'object' && value !== null && 'File' in value && 'RuleID' in value;
}

export function runGitleaks(binary: string, cwd: string): Finding[] {
  const folder = mkdtempSync(join(tmpdir(), 'check-secrets-'));
  const report = join(folder, 'report.json');
  try {
    const run = spawnSync(binary, [...ARGUMENTS, ...REPORT, report], { cwd, encoding: 'utf8' });
    if (run.status !== 0) throw new Error(`check-secrets: gitleaks failed\n${run.stderr}`);
    const parsed: unknown = JSON.parse(readFileSync(report, 'utf8'));
    return Array.isArray(parsed) ? parsed.filter(isFinding) : [];
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
}
