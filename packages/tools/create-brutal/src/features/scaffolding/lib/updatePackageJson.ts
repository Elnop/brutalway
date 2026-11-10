import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { PackageJson } from '#src/features/scaffolding/ScaffoldTypes.ts';
import { isRecord } from '#src/shared/lib/isRecord.ts';

export function updatePackageJson(dir: string, update: (pkg: PackageJson) => void): void {
  const path = join(dir, 'package.json');
  const pkg: unknown = JSON.parse(readFileSync(path, 'utf8'));
  if (!isRecord(pkg)) throw new Error('package.json is not an object');
  update(pkg);
  writeFileSync(path, `${JSON.stringify(pkg, null, 2)}\n`);
}
