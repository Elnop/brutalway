import { STEPS } from '#src/features/steps/StepsConfig.ts';
import { missingPart } from '#src/features/steps/lib/missingPart.ts';
import { runStep } from '#src/features/steps/lib/runStep.ts';
import type { Manifest, StepsReport } from '#src/features/steps/StepsTypes.ts';

function say(line: string): void {
  process.stdout.write(`brutal-check: ${line}\n`);
}

export function runSteps(manifest: Manifest, cwd: string): StepsReport {
  const report: StepsReport = { failed: [], skipped: [] };
  for (const step of STEPS) {
    const missing = missingPart(step, manifest);
    if (missing !== undefined) {
      report.skipped.push(`${step.name} (${missing})`);
      continue;
    }
    say(step.name);
    if (!runStep(step, cwd)) report.failed.push(step.name);
  }
  if (report.skipped.length > 0) say(`skipped ${report.skipped.join(', ')}`);
  say(report.failed.length === 0 ? 'every check passed' : `${report.failed.join(', ')} failed`);
  return report;
}
