import { spawnSync } from 'node:child_process';

export function committableFiles(cwd: string): Set<string> | undefined {
  const run = spawnSync(
    'git',
    ['-c', 'core.quotepath=off', 'ls-files', '--cached', '--others', '--exclude-standard'],
    { cwd, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 },
  );
  if (run.status !== 0) return undefined;
  return new Set(run.stdout.split('\n').filter((line) => line !== ''));
}
