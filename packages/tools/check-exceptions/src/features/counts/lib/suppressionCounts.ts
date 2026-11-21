import { OXLINT_SUPPRESSIONS_FILE } from '#src/features/counts/CountsConfig.ts';
import { field } from '#src/features/counts/lib/field.ts';
import { parseJson } from '#src/features/counts/lib/parseJson.ts';
import type { Snapshot } from '#src/shared/snapshot/SnapshotTypes.ts';

function objectValues(value: unknown): [string, unknown][] {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? Object.entries(value)
    : [];
}

export function suppressionCounts(snapshot: Snapshot): [string, number][] {
  const files = parseJson(snapshot.read(OXLINT_SUPPRESSIONS_FILE), OXLINT_SUPPRESSIONS_FILE);
  return objectValues(files).flatMap(([, rules]) =>
    objectValues(rules).map(([rule, entry]): [string, number] => {
      const count = field(entry, 'count');
      return [`oxlint-suppressions ${rule}`, typeof count === 'number' ? count : 1];
    }),
  );
}
