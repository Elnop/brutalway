import { spawn } from 'node:child_process';

export function runProcess(command: string, args: string[], cwd: string): Promise<{ ok: boolean; output: string; stdout: string }> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, env: { ...process.env, CI: '1' } });
    let output = '';
    let stdout = '';
    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
      output += chunk.toString();
    });
    child.stderr.on('data', (chunk: Buffer) => (output += chunk.toString()));
    child.on('close', (code) => resolve({ ok: code === 0, output, stdout }));
  });
}
