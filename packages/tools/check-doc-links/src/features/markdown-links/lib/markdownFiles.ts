import { globSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DocLinksSettings, MarkdownFile } from '#src/features/markdown-links/MarkdownLinksTypes.ts';

export function markdownFiles(cwd: string, settings: DocLinksSettings): MarkdownFile[] {
  const paths = new Set(settings.include.flatMap((pattern) => globSync(pattern, { cwd, exclude: settings.ignore })));
  return [...paths].toSorted().map((path) => ({ path, content: readFileSync(join(cwd, path), 'utf8') }));
}
