import { runQuietly } from './runQuietly.ts';
import type { Step } from './StepTypes.ts';

export async function runSteps(steps: readonly Step[]): Promise<number> {
  for (const step of steps) {
    const status = await runQuietly(step);
    if (status !== 0) return status;
  }
  return 0;
}
