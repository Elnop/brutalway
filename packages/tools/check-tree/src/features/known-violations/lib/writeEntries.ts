import { writeFileSync } from 'node:fs';
import type { KnownViolation } from '#src/shared/violations/ViolationTypes.ts';

export function writeEntries(entries: readonly KnownViolation[], file: string): void {
  const sorted = entries
    .map(({ rule, path, count }) => (count === undefined ? { rule, path } : { rule, path, count }))
    .toSorted((a, b) => a.path.localeCompare(b.path) || a.rule.localeCompare(b.rule));
  writeFileSync(file, `${JSON.stringify(sorted, undefined, 2)}\n`);
}
