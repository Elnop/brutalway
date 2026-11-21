export function countBy(entries: Iterable<readonly [string, number]>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [key, count] of entries) counts.set(key, (counts.get(key) ?? 0) + count);
  return counts;
}
