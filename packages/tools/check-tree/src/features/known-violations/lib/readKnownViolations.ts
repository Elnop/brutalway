import { existsSync, readFileSync } from 'node:fs';
import type { KnownViolation } from '#src/shared/violations/ViolationTypes.ts';

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

export function readKnownViolations(file: string): KnownViolation[] {
  if (!existsSync(file)) return [];
  const parsed: unknown = JSON.parse(readFileSync(file, 'utf8'));
  if (!Array.isArray(parsed) || !parsed.every(isKnownViolation)) {
    throw new Error(
      `${file} holds a JSON array of { "rule", "path", "count" } objects, count being optional: run check-tree with --write-known-violations to write it in this format`,
    );
  }
  return parsed;
}
