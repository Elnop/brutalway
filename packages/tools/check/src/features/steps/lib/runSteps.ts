import { STEPS } from '#src/features/steps/StepsConfig.ts';
import { runStep } from '#src/features/steps/lib/runStep.ts';
import type { Manifest, StepsReport } from '#src/features/steps/StepsTypes.ts';

function say(line: string): void {
  process.stdout.write(`brutal-check: ${line}\n`);
}

export function runSteps(manifest: Manifest, cwd: string): StepsReport {
  const report: StepsReport = { failed: [], skipped: [] };
  for (const script of STEPS) {
    if (manifest.scripts[script] === undefined) {
      report.skipped.push(script);
      continue;
    }
    say(script);
    if (!runStep(script, cwd)) report.failed.push(script);
  }
  if (report.skipped.length > 0) say(`no script for ${report.skipped.join(', ')}`);
  say(report.failed.length === 0 ? 'every check passed' : `${report.failed.join(', ')} failed`);
  return report;
}
