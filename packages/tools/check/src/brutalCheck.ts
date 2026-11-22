#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { readManifest } from '#src/features/steps/lib/readManifest.ts';
import { runSteps } from '#src/features/steps/lib/runSteps.ts';

try {
  const { values } = parseArgs({ options: { serial: { type: 'boolean' } } });
  const report = await runSteps(
    readManifest('package.json'),
    process.cwd(),
    values.serial === true,
  );
  process.exitCode = report.failed.length === 0 ? 0 : 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
