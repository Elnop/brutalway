import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { listFiles } from '#src/features/update/lib/listFiles.ts';
import type { FileComparison } from '#src/features/update/UpdateTypes.ts';

function sameContent(from: string, to: string): boolean {
  return existsSync(to) && readFileSync(from).equals(readFileSync(to));
}

export function compareFiles(renderDir: string, projectDir: string): FileComparison {
  const files = listFiles(renderDir);
  return {
    total: files.length,
    present: files.filter((file) => existsSync(join(projectDir, file))).length,
    identical: files.filter((file) => sameContent(join(renderDir, file), join(projectDir, file)))
      .length,
  };
}

export function rendersDiffer(oldDir: string, newDir: string): boolean {
  const comparison = compareFiles(newDir, oldDir);
  return (
    comparison.identical !== comparison.total ||
    listFiles(oldDir).length !== comparison.total ||
    !sameContent(join(oldDir, 'package.json'), join(newDir, 'package.json'))
  );
}
