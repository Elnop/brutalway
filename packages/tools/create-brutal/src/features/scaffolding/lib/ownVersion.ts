import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isRecord } from '#src/shared/is-record/isRecord.ts';
import { packageRoot } from '#src/features/scaffolding/lib/packageRoot.ts';

export function ownVersion(): string {
  const manifest: unknown = JSON.parse(
    readFileSync(join(packageRoot(import.meta.dirname), 'package.json'), 'utf8'),
  );
  const version = isRecord(manifest) ? manifest['version'] : undefined;
  if (typeof version !== 'string') {
    throw new Error('the package.json of create-brutal has no version');
  }
  return version;
}
