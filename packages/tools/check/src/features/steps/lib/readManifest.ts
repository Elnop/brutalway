import { readFileSync } from 'node:fs';
import type { Manifest } from '#src/features/steps/StepsTypes.ts';

function stringRecord(parsed: unknown, key: string): Record<string, string> {
  const value: unknown =
    typeof parsed === 'object' && parsed !== null ? Reflect.get(parsed, key) : undefined;
  if (typeof value !== 'object' || value === null) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  );
}

export function readManifest(file: string): Manifest {
  const parsed: unknown = JSON.parse(readFileSync(file, 'utf8'));
  return {
    scripts: stringRecord(parsed, 'scripts'),
    dependencies: new Set([
      ...Object.keys(stringRecord(parsed, 'dependencies')),
      ...Object.keys(stringRecord(parsed, 'devDependencies')),
    ]),
  };
}
