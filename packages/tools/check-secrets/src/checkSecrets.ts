#!/usr/bin/env node
import { gitleaksBinary } from '#src/features/binary/lib/gitleaksBinary.ts';
import { committableFiles } from '#src/features/findings/lib/committableFiles.ts';
import { reportedFindings } from '#src/features/findings/lib/reportedFindings.ts';
import { runGitleaks } from '#src/features/findings/lib/runGitleaks.ts';

const cwd = process.cwd();

try {
  const findings = runGitleaks(await gitleaksBinary(cwd), cwd);
  const reported = reportedFindings(findings, committableFiles(cwd));
  for (const line of reported) process.stderr.write(`${line}\n`);
  process.exitCode = reported.length === 0 ? 0 : 1;
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
