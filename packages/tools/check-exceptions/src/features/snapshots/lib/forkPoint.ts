import { DEFAULT_BRANCHES } from '#src/features/snapshots/SnapshotConfig.ts';
import { git } from '#src/features/snapshots/lib/git.ts';

function commitOf(cwd: string, ref: string): string | undefined {
  return git(cwd, ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`])?.trim();
}

export function forkPoint(cwd: string, base: string | undefined): string | undefined {
  if (commitOf(cwd, 'HEAD') === undefined) return undefined;
  if (base !== undefined) {
    if (commitOf(cwd, base) === undefined) {
      throw new Error(`check-exceptions: ${base} is not a commit of this repository`);
    }
    return git(cwd, ['merge-base', base, 'HEAD'])?.trim();
  }
  const branch = DEFAULT_BRANCHES.find((ref) => commitOf(cwd, ref) !== undefined);
  return branch === undefined ? undefined : git(cwd, ['merge-base', branch, 'HEAD'])?.trim();
}
