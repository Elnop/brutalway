import { isRecord } from '#src/shared/is-record/isRecord.ts';
import type { JsonMerge } from '#src/features/update/UpdateTypes.ts';

function same(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function mergeObjects(
  base: Record<string, unknown>,
  ours: Record<string, unknown>,
  theirs: Record<string, unknown>,
  path: string,
): JsonMerge {
  const entries: [string, unknown][] = [];
  const conflicts: string[] = [];
  for (const key of new Set([...Object.keys(ours), ...Object.keys(theirs)])) {
    const merged = mergeJson(
      base[key],
      ours[key],
      theirs[key],
      path === '' ? key : `${path}.${key}`,
    );
    conflicts.push(...merged.conflicts);
    if (merged.value !== undefined) entries.push([key, merged.value]);
  }
  return { value: Object.fromEntries(entries), conflicts };
}

export function mergeJson(base: unknown, ours: unknown, theirs: unknown, path = ''): JsonMerge {
  if (same(theirs, base) || same(ours, theirs)) return { value: ours, conflicts: [] };
  if (same(ours, base)) return { value: theirs, conflicts: [] };
  if (isRecord(ours) && isRecord(theirs) && (base === undefined || isRecord(base))) {
    return mergeObjects(base ?? {}, ours, theirs, path);
  }
  return { value: ours, conflicts: [path] };
}
