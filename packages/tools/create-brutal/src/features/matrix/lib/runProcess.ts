import { spawn } from 'node:child_process';

const MATRIX_ENV = { CI: '1', pnpm_config_verify_deps_before_run: 'false' };

export function runProcess(
  command: string,
  args: string[],
  cwd: string,
): Promise<{ ok: boolean; output: string; stdout: string }> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, env: { ...process.env, ...MATRIX_ENV } });
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
