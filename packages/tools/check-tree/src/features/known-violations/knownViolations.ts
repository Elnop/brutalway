import { existsSync, readFileSync, writeFileSync } from 'node:fs';

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function readKnownViolations(file: string): string[] {
  if (!existsSync(file)) return [];
  const parsed: unknown = JSON.parse(readFileSync(file, 'utf8'));
  if (!isStringList(parsed)) {
    throw new Error(`${file} holds a JSON array with one string per known violation`);
  }
  return parsed;
}

export function unknownViolations(violations: readonly string[], file: string): string[] {
  const known = new Set(readKnownViolations(file));
  const found = new Set(violations);
  return [
    ...violations.filter((violation) => !known.has(violation)),
    ...[...known]
      .filter((entry) => !found.has(entry))
      .map((entry) => `${file} lists a violation that no longer happens: ${entry}`),
  ];
}

export function writeKnownViolations(violations: readonly string[], file: string): void {
  writeFileSync(file, `${JSON.stringify(violations.toSorted(), undefined, 2)}\n`);
}
