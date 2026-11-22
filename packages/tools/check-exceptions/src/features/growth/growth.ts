function atForkPoint(before: ReadonlyMap<string, number>, key: string): number | undefined {
  const count = before.get(key);
  return count === 0 ? undefined : count;
}

export function growth(
  before: ReadonlyMap<string, number>,
  after: ReadonlyMap<string, number>,
  newRules: Readonly<Record<string, number>>,
  baseLabel: string,
): string[] {
  return [...after]
    .filter(([key, count]) => count > (atForkPoint(before, key) ?? newRules[key] ?? 0))
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => {
      const known = atForkPoint(before, key);
      const allowed =
        known === undefined
          ? `${newRules[key] ?? 0} allowed for a new rule by "newRules" in package.json`
          : `${known} at ${baseLabel}`;
      return `${key}: ${count} exceptions now, ${allowed}: fix the code instead of adding an exception`;
    });
}
