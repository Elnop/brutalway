import { readFileSync } from 'node:fs';
import type { Manifest } from '#src/features/steps/StepsTypes.ts';

export function readManifest(file: string): Manifest {
  const parsed: unknown = JSON.parse(readFileSync(file, 'utf8'));
  const scripts: unknown =
    typeof parsed === 'object' && parsed !== null ? Reflect.get(parsed, 'scripts') : undefined;
  if (typeof scripts !== 'object' || scripts === null) return { scripts: {} };
  return {
    scripts: Object.fromEntries(
      Object.entries(scripts).filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string',
      ),
    ),
  };
}
