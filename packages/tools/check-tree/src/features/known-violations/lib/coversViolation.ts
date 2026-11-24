import type { KnownViolation, Violation } from '#src/shared/violations/ViolationTypes.ts';

export function coversViolation(entry: KnownViolation, violation: Violation): boolean {
  return (
    entry.rule === violation.rule &&
    entry.path === violation.path &&
    (violation.count ?? 0) <= (entry.count ?? 0)
  );
}
