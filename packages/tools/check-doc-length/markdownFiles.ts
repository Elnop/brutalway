import { globSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DocLengthSettings, LongDoc, WrittenFile } from './DocLengthTypes.ts';

export function markdownFiles(cwd: string, settings: DocLengthSettings): WrittenFile[] {
  const paths = new Set(settings.include.flatMap((pattern) => globSync(pattern, { cwd, exclude: settings.ignore })));
  return [...paths].toSorted().map((path) => ({ path, content: readFileSync(join(cwd, path), 'utf8') }));
}

export function longDocs(files: WrittenFile[], settings: DocLengthSettings): LongDoc[] {
  return files.map((file) => ({ path: file.path, lines: file.content.split('\n').length - (file.content.endsWith('\n') ? 1 : 0) })).filter((doc) => doc.lines > settings.maxLines);
}
