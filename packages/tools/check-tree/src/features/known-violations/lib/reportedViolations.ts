import type { Violation } from '#src/shared/violations/ViolationTypes.ts';
import { coversViolation } from '#src/features/known-violations/lib/coversViolation.ts';
import { readKnownViolations } from '#src/features/known-violations/lib/readKnownViolations.ts';

export function reportedViolations(violations: readonly Violation[], file: string): Violation[] {
  const known = readKnownViolations(file);
  return violations.filter(
    (violation) => !known.some((entry) => coversViolation(entry, violation)),
  );
}
