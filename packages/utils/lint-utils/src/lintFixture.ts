import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import type { OxlintReport } from '#src/shared/types/OxlintReportTypes.ts';

const OXLINT_BIN = fileURLToPath(new URL('bin/oxlint', import.meta.resolve('oxlint/package.json')));

export function lintFixture(directory: string): string[] {
  const run = spawnSync(process.execPath, [OXLINT_BIN, '-c', 'oxlint.config.ts', '--format', 'json', '.'], { cwd: directory, encoding: 'utf8' });
  if (run.error) throw run.error;
  const report: OxlintReport = JSON.parse(run.stdout);
  return report.diagnostics
    .map((diagnostic) => ({ file: diagnostic.filename, line: diagnostic.labels[0]?.span.line ?? 0, code: diagnostic.code }))
    .toSorted((left, right) => left.file.localeCompare(right.file) || left.line - right.line || left.code.localeCompare(right.code))
    .map(({ file, line, code }) => `${file}:${line} ${code}`);
}
