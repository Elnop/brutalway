import { spawnSync } from 'node:child_process';

export function git(cwd: string, args: readonly string[]): string | undefined {
  const result = spawnSync('git', ['-c', 'core.quotepath=off', ...args], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  });
  return result.status === 0 ? result.stdout : undefined;
}
