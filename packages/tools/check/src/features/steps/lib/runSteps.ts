import { STEPS } from '#src/features/steps/StepsConfig.ts';
import { reportStep } from '#src/features/steps/lib/reportStep.ts';
import { runStep } from '#src/features/steps/lib/runStep.ts';
import { packageManagerOf } from '#src/features/steps/lib/packageManagerOf.ts';
import type { Manifest, StepResult, StepsReport } from '#src/features/steps/StepsTypes.ts';

function say(line: string): void {
  process.stdout.write(`brutal-check: ${line}\n`);
}

type StepRun = { cwd: string; serial: boolean; packageManager: string };

async function runAll(
  scripts: string[],
  { cwd, serial, packageManager }: StepRun,
): Promise<StepResult[]> {
  if (!serial) {
    return Promise.all(
      scripts.map((script) => runStep(script, cwd, packageManager).then(reportResult)),
    );
  }
  const results: StepResult[] = [];
  for (const script of scripts) {
    results.push(reportResult(await runStep(script, cwd, packageManager)));
  }
  return results;
}

function reportResult(result: StepResult): StepResult {
  reportStep(result);
  return result;
}

export async function runSteps(
  manifest: Manifest,
  cwd: string,
  serial: boolean,
): Promise<StepsReport> {
  const present = STEPS.filter((script) => manifest.scripts[script] !== undefined);
  const skipped = STEPS.filter((script) => manifest.scripts[script] === undefined);
  if (skipped.length > 0) say(`no script for ${skipped.join(', ')}`);
  const packageManager = packageManagerOf(process.env['npm_config_user_agent'], manifest);
  const results = await runAll(present, { cwd, serial, packageManager });
  const failed = results.filter((result) => !result.passed).map((result) => result.script);
  say(failed.length === 0 ? 'every check passed' : `${failed.join(', ')} failed`);
  return { failed, skipped };
}
