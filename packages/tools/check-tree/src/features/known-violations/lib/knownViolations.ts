import { existsSync } from 'node:fs';
import type { KnownViolation, Violation } from '#src/shared/violations/ViolationTypes.ts';
import { readKnownViolations } from '#src/features/known-violations/lib/readKnownViolations.ts';
import { currentViolation } from '#src/features/known-violations/lib/currentViolation.ts';
import { writeEntries } from '#src/features/known-violations/lib/writeEntries.ts';
import { reportedViolations } from '#src/features/known-violations/lib/reportedViolations.ts';

const SHRINK_HINT = 'run check-tree with --shrink-known-violations';

function staleEntryMessage(
  entry: KnownViolation,
  violations: readonly Violation[],
  file: string,
): string | undefined {
  const current = currentViolation(entry, violations);
  if (current === undefined) {
    return `${file} lists ${entry.rule} for ${entry.path}, which no longer happens: delete the entry or ${SHRINK_HINT}`;
  }
  const count = current.count ?? 0;
  if (entry.count === undefined || entry.count <= count) return undefined;
  return `${file} lists ${entry.rule} for ${entry.path} with a count of ${String(entry.count)}, which is now ${String(count)}: lower it or ${SHRINK_HINT}`;
}

export function unknownViolations(violations: readonly Violation[], file: string): string[] {
  const known = readKnownViolations(file);
  return [
    ...reportedViolations(violations, file).map(({ message }) => message),
    ...known.flatMap((entry) => staleEntryMessage(entry, violations, file) ?? []),
  ];
}

export function writeKnownViolations(violations: readonly Violation[], file: string): void {
  writeEntries(violations, file);
}

export function shrinkKnownViolations(violations: readonly Violation[], file: string): void {
  if (!existsSync(file)) return;
  const shrunk = readKnownViolations(file).flatMap((entry) => {
    const current = currentViolation(entry, violations);
    if (current === undefined) return [];
    if (entry.count === undefined || current.count === undefined) return [entry];
    return [{ ...entry, count: Math.min(entry.count, current.count) }];
  });
  writeEntries(shrunk, file);
}
