import { spawnSync } from 'node:child_process';

export function runCommand(command: string, args: string[], cwd: string, quiet = false): string {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: quiet ? 'pipe' : 'inherit',
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed${quiet ? `: ${result.stderr}` : ''}`);
  }
  return result.stdout ?? '';
}
