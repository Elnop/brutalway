import { ALINT_BASELINE_FILE } from '#src/features/counts/CountsConfig.ts';
import { field } from '#src/features/counts/lib/field.ts';
import { parseJson } from '#src/features/counts/lib/parseJson.ts';
import type { Snapshot } from '#src/shared/snapshot/SnapshotTypes.ts';

export function alintBaselineCounts(snapshot: Snapshot): [string, number][] {
  const lines = (snapshot.read(ALINT_BASELINE_FILE) ?? '').split('\n');
  return lines
    .filter((line) => line.trim() !== '')
    .map((line) => parseJson(line, ALINT_BASELINE_FILE))
    .flatMap((entry): [string, number][] => {
      const rule = field(entry, 'rule_id');
      const count = field(entry, 'count');
      if (typeof rule !== 'string') return [];
      return [[`alint ${rule}`, typeof count === 'number' ? count : 1]];
    });
}
