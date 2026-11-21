import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import type { KnownViolation, Violation } from '#src/shared/violations/ViolationTypes.ts';

function isKnownViolation(value: unknown): value is KnownViolation {
  if (typeof value !== 'object' || value === null) return false;
  if (!('rule' in value) || !('path' in value)) return false;
  const count = 'count' in value ? value.count : undefined;
  return (
    typeof value.rule === 'string' &&
    typeof value.path === 'string' &&
    (count === undefined || typeof count === 'number')
  );
}

function readKnownViolations(file: string): KnownViolation[] {
  if (!existsSync(file)) return [];
  const parsed: unknown = JSON.parse(readFileSync(file, 'utf8'));
  if (!Array.isArray(parsed) || !parsed.every(isKnownViolation)) {
    throw new Error(
      `${file} holds a JSON array of { "rule", "path", "count" } objects, count being optional: run check-tree with --write-known-violations to write it in this format`,
    );
  }
  return parsed;
}

function covers(entry: KnownViolation, violation: Violation): boolean {
  return (
    entry.rule === violation.rule &&
    entry.path === violation.path &&
    (violation.count ?? 0) <= (entry.count ?? 0)
  );
}

export function unknownViolations(violations: readonly Violation[], file: string): string[] {
  const known = readKnownViolations(file);
  return [
    ...violations
      .filter((violation) => !known.some((entry) => covers(entry, violation)))
      .map(({ message }) => message),
    ...known
      .filter(
        (entry) => !violations.some(({ rule, path }) => rule === entry.rule && path === entry.path),
      )
      .map(
        ({ rule, path }) =>
          `${file} lists ${rule} for ${path}, which no longer happens: delete the entry`,
      ),
  ];
}

export function writeKnownViolations(violations: readonly Violation[], file: string): void {
  const entries = violations
    .map(({ rule, path, count }) => (count === undefined ? { rule, path } : { rule, path, count }))
    .toSorted((a, b) => a.path.localeCompare(b.path) || a.rule.localeCompare(b.rule));
  writeFileSync(file, `${JSON.stringify(entries, undefined, 2)}\n`);
}
