import { globSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DocSourcesSettings, MarkdownFile } from '#src/features/citations/DocSourcesTypes.ts';

export function markdownFiles(cwd: string, settings: DocSourcesSettings): MarkdownFile[] {
  const paths = new Set(
    settings.include.flatMap((pattern) => globSync(pattern, { cwd, exclude: settings.ignore })),
  );
  return [...paths]
    .toSorted()
    .map((path) => ({ path, content: readFileSync(join(cwd, path), 'utf8') }));
}
