import { spawnSync } from 'node:child_process';
import type { Step } from '#src/features/steps/StepsTypes.ts';

export function runStep(step: Step, cwd: string): boolean {
  const [command, args] =
    'script' in step ? ['npm', ['run', '--silent', step.script]] : [step.command, step.args];
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  return result.status === 0;
}
