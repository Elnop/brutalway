import { readFileSync } from 'node:fs';
import type { Manifest } from '#src/features/steps/StepsTypes.ts';

function fieldOf(parsed: unknown, name: string): unknown {
  return typeof parsed === 'object' && parsed !== null ? Reflect.get(parsed, name) : undefined;
}

function stringEntries(record: unknown): Record<string, string> {
  if (typeof record !== 'object' || record === null) return {};
  return Object.fromEntries(
    Object.entries(record).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  );
}

export function readManifest(file: string): Manifest {
  const parsed: unknown = JSON.parse(readFileSync(file, 'utf8'));
  const packageManager = fieldOf(parsed, 'packageManager');
  return {
    scripts: stringEntries(fieldOf(parsed, 'scripts')),
    ...(typeof packageManager === 'string' ? { packageManager } : {}),
  };
}
