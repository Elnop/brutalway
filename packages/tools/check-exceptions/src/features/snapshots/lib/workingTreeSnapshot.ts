import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Snapshot } from '#src/shared/snapshot/SnapshotTypes.ts';
import { directiveLines } from '#src/features/snapshots/lib/directiveLines.ts';

export function workingTreeSnapshot(cwd: string): Snapshot {
  return {
    label: 'now',
    read: (path) =>
      existsSync(join(cwd, path)) ? readFileSync(join(cwd, path), 'utf8') : undefined,
    directives: () => directiveLines(cwd, '--untracked'),
  };
}
