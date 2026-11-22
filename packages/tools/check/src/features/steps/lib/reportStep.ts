import type { StepResult } from '#src/features/steps/StepsTypes.ts';

export function reportStep({ script, passed, seconds, output }: StepResult): void {
  const status = passed ? 'OK' : 'FAILED';
  process.stdout.write(`brutal-check: ${script} ${status} (${seconds.toFixed(1)}s)\n`);
  if (!passed && output.trim() !== '') process.stdout.write(`${output.trimEnd()}\n`);
}
