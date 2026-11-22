import { spawn } from 'node:child_process';
import type { StepResult } from '#src/features/steps/StepsTypes.ts';

export function runStep(script: string, cwd: string): Promise<StepResult> {
  const started = performance.now();
  const chunks: Buffer[] = [];
  const child = spawn('npm', ['run', '--silent', script], { cwd });
  child.stdout.on('data', (chunk: Buffer) => chunks.push(chunk));
  child.stderr.on('data', (chunk: Buffer) => chunks.push(chunk));
  return new Promise((resolve) => {
    child.on('close', (code) => {
      resolve({
        script,
        passed: code === 0,
        seconds: (performance.now() - started) / 1000,
        output: Buffer.concat(chunks).toString('utf8'),
      });
    });
  });
}
