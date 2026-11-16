import { readdirSync, rmdirSync } from 'node:fs';
import { join } from 'node:path';

export function dropEmptyFolders(dir: string): boolean {
  const remaining = readdirSync(dir, { withFileTypes: true }).filter(
    (entry) => !entry.isDirectory() || !dropEmptyFolders(join(dir, entry.name)),
  );
  if (remaining.length > 0) return false;
  rmdirSync(dir);
  return true;
}
