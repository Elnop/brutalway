import type { Snapshot } from '#src/shared/snapshot/SnapshotTypes.ts';
import { directiveLines } from '#src/features/snapshots/lib/directiveLines.ts';
import { git } from '#src/features/snapshots/lib/git.ts';

export function commitSnapshot(cwd: string, commit: string): Snapshot {
  const prefix = git(cwd, ['rev-parse', '--show-prefix'])?.trim() ?? '';
  return {
    label: `the fork point ${commit.slice(0, 7)}`,
    read: (path) => git(cwd, ['show', `${commit}:${prefix}${path}`]),
    directives: () => directiveLines(cwd, { commit }),
  };
}
