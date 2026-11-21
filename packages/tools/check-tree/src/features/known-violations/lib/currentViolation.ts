import type { KnownViolation, Violation } from '#src/shared/violations/ViolationTypes.ts';

export function currentViolation(
  entry: KnownViolation,
  violations: readonly Violation[],
): Violation | undefined {
  return violations.find(({ rule, path }) => rule === entry.rule && path === entry.path);
}
