import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { MERGED_SEPARATELY } from '#src/features/update/UpdateConfig.ts';

export function listFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => relative(dir, join(entry.parentPath, entry.name)))
    .filter((path) => !MERGED_SEPARATELY.includes(path))
    .toSorted();
}
