import { countBy } from '#src/features/counts/lib/countBy.ts';
import { directiveCounts } from '#src/features/counts/lib/directiveCounts.ts';
import { listFileCounts } from '#src/features/counts/lib/listFileCounts.ts';
import { suppressionCounts } from '#src/features/counts/lib/suppressionCounts.ts';
import type { Snapshot } from '#src/shared/snapshot/SnapshotTypes.ts';

export function exceptionCounts(snapshot: Snapshot): Map<string, number> {
  return countBy([
    ...listFileCounts(snapshot),
    ...suppressionCounts(snapshot),
    ...directiveCounts(snapshot.directives()),
  ]);
}
