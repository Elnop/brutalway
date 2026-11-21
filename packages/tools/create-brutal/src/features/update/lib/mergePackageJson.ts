import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { mergeJson } from '#src/features/update/lib/mergeJson.ts';

function readJson(path: string): unknown {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : undefined;
}

export function mergePackageJson(projectDir: string, oldDir: string, newDir: string): string[] {
  const target = join(projectDir, 'package.json');
  const ours = readJson(target);
  const merged = mergeJson(
    readJson(join(oldDir, 'package.json')),
    ours,
    readJson(join(newDir, 'package.json')),
  );
  if (JSON.stringify(merged.value) !== JSON.stringify(ours) && merged.value !== undefined) {
    writeFileSync(target, `${JSON.stringify(merged.value, null, 2)}\n`);
  }
  return merged.conflicts;
}
