import { globSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { withoutGitIgnored } from '#src/shared/docs/lib/withoutGitIgnored.ts';
import type { DocLengthSettings, WrittenFile } from '#src/shared/docs/DocLengthTypes.ts';

export function markdownFiles(cwd: string, settings: DocLengthSettings): WrittenFile[] {
  const paths = new Set(
    settings.include.flatMap((pattern) => globSync(pattern, { cwd, exclude: settings.ignore })),
  );
  return withoutGitIgnored(cwd, [...paths])
    .toSorted()
    .map((path) => ({ path, content: readFileSync(join(cwd, path), 'utf8') }));
}
