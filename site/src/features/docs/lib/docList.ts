import { DOC_SOURCES } from '@/features/docs/DocsConfig.ts';
import type { DocEntry, DocSource } from '@/features/docs/DocsTypes.ts';
import { listMarkdownFiles } from '@/features/docs/githubClient.ts';
import { docTitle } from '@/features/docs/lib/docTitle.ts';
import { writeCachedList } from '@/features/docs/lib/docsStorage.ts';

function sourceEntries(source: DocSource, folderPaths: string[]): DocEntry[] {
  const paths = [...source.files, ...folderPaths, ...(source.changelog === undefined ? [] : [source.changelog])];
  return paths.map((path) => ({ sourceKey: source.key, path, title: docTitle(path) }));
}

export function fixedEntries(): DocEntry[] {
  return DOC_SOURCES.flatMap((source) => sourceEntries(source, []));
}

export async function loadDocList(signal: AbortSignal): Promise<DocEntry[]> {
  const folders = await Promise.all(DOC_SOURCES.map((source) => listMarkdownFiles(source, signal)));
  const entries = DOC_SOURCES.flatMap((source, index) => sourceEntries(source, folders[index] ?? []));
  if (folders.every((folder) => folder !== undefined)) writeCachedList(entries);
  return entries;
}
