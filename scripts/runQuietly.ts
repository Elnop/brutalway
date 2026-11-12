import { spawn } from 'node:child_process';
import type { Step } from './StepTypes.ts';

const colorEnv = process.stdout.isTTY ? { ...process.env, FORCE_COLOR: '1' } : process.env;

function capture({ command, args, cwd }: Step): Promise<{ status: number; output: string }> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const child = spawn(command, args, { cwd, env: colorEnv, stdio: ['ignore', 'pipe', 'pipe'] });
    child.stdout.on('data', (chunk: Buffer) => chunks.push(chunk));
    child.stderr.on('data', (chunk: Buffer) => chunks.push(chunk));
    child.on('error', reject);
    child.on('close', (status) => {
      resolve({ status: status ?? 1, output: Buffer.concat(chunks).toString('utf8') });
    });
  });
}

export async function runQuietly(step: Step): Promise<number> {
  const { status, output } = await capture(step);
  const report = output.trimEnd();
  if (status === 0 && (step.reportsWhenPassing !== true || report === '')) {
    process.stdout.write(`${step.label} ok\n`);
    return 0;
  }
  const verdict = status === 0 ? 'passed with notes' : 'failed';
  process.stdout.write(`\n${step.label} ${verdict}\n\n${report}\n\n`);
  return status;
}
