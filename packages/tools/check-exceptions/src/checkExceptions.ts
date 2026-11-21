#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { exceptionCounts } from '#src/features/counts/lib/exceptionCounts.ts';
import { growth } from '#src/features/growth/growth.ts';
import { readSettings } from '#src/features/settings/readSettings.ts';
import { commitSnapshot } from '#src/features/snapshots/lib/commitSnapshot.ts';
import { forkPoint } from '#src/features/snapshots/lib/forkPoint.ts';
import { workingTreeSnapshot } from '#src/features/snapshots/lib/workingTreeSnapshot.ts';

const { values } = parseArgs({ options: { base: { type: 'string' } } });
const cwd = process.cwd();

function check(): number {
  const settings = readSettings(cwd);
  const commit = forkPoint(cwd, values.base);
  if (commit === undefined) {
    process.stderr.write('check-exceptions: no main branch to compare with, nothing checked.\n');
    return 0;
  }
  const base = commitSnapshot(cwd, commit);
  const grown = growth(
    exceptionCounts(base),
    exceptionCounts(workingTreeSnapshot(cwd)),
    settings.newRules,
    base.label,
  );
  for (const line of grown) process.stderr.write(`${line}\n`);
  return grown.length === 0 ? 0 : 1;
}

try {
  process.exitCode = check();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
