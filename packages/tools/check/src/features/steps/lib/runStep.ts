import { spawnSync } from 'node:child_process';

export function runStep(script: string, cwd: string): boolean {
  return spawnSync('npm', ['run', '--silent', script], { cwd, stdio: 'inherit' }).status === 0;
}
