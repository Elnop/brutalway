import { spawnSync } from 'node:child_process';

export function withoutGitIgnored(cwd: string, paths: string[]): string[] {
  const run = spawnSync(
    'git',
    ['-c', 'core.quotepath=off', 'ls-files', '--cached', '--others', '--exclude-standard', '-z'],
    { cwd, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 },
  );
  if (run.status !== 0) return paths;
  const visible = new Set(run.stdout.split('\0'));
  return paths.filter((path) => visible.has(path));
}
