import { existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { SNAPSHOT_FOLDER } from '#src/features/test-mirror/TestMirrorConfig.ts';
import type { TreeEntries } from '#src/features/test-mirror/TestMirrorTypes.ts';

export function treeEntries(root: string): TreeEntries {
  if (!existsSync(root)) return { files: [], folders: [] };
  const entries = readdirSync(root, { recursive: true, withFileTypes: true })
    .map((entry) => ({ entry, path: relative(root, join(entry.parentPath, entry.name)) }))
    .filter(({ path }) => !path.split('/').includes(SNAPSHOT_FOLDER));
  return {
    files: entries
      .filter(({ entry }) => entry.isFile())
      .map(({ path }) => path)
      .toSorted(),
    folders: entries
      .filter(({ entry }) => entry.isDirectory())
      .map(({ path }) => path)
      .toSorted(),
  };
}
