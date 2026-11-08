import { execFileSync } from 'node:child_process';

function git(cwd: string, args: string[]): string[] {
  return execFileSync('git', ['-c', 'core.quotepath=off', ...args], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    .split('\n')
    .filter((line) => line !== '');
}

function hasCommit(cwd: string): boolean {
  try {
    git(cwd, ['rev-parse', '--verify', 'HEAD']);
    return true;
  } catch {
    return false;
  }
}

export function changedFiles(cwd: string, base: string | undefined): Set<string> {
  git(cwd, ['rev-parse', '--git-dir']);
  if (base === undefined && !hasCommit(cwd)) return new Set();
  const from = base === undefined ? 'HEAD' : (git(cwd, ['merge-base', base, 'HEAD'])[0] ?? base);
  return new Set([...git(cwd, ['diff', '-w', '--name-only', '--relative', from]), ...git(cwd, ['ls-files', '--others', '--exclude-standard'])]);
}
