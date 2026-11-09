import { DOC_SOURCES } from '@/features/docs/DocsConfig.ts';
import type { DocEntry, DocSource } from '@/features/docs/DocsTypes.ts';
import { listRepositoryFiles } from '@/features/docs/githubClient.ts';
import { docTitle } from '@/features/docs/lib/docTitle.ts';
import { repositoryPath, sourcePath } from '@/features/docs/lib/docsUrls.ts';

function sourceEntries(source: DocSource, folderPaths: string[]): DocEntry[] {
  const paths = [...source.files, ...folderPaths, ...(source.changelog === undefined ? [] : [source.changelog])];
  return paths.map((path) => ({ sourceKey: source.key, path, title: docTitle(path) }));
}

function folderDocs(source: DocSource, files: string[] | undefined): string[] {
  if (source.folder === undefined || files === undefined) return [];
  const prefix = `${repositoryPath(source, source.folder)}/`;
  return files.filter((file) => file.startsWith(prefix) && file.endsWith('.md')).map((file) => sourcePath(source, file));
}

export function fixedEntries(): DocEntry[] {
  return DOC_SOURCES.flatMap((source) => sourceEntries(source, []));
}

export async function loadDocList(signal: AbortSignal): Promise<DocEntry[]> {
  const repos = [...new Set(DOC_SOURCES.map((source) => source.repo))];
  const trees = new Map(await Promise.all(repos.map(async (repo) => [repo, await listRepositoryFiles(repo, signal)] as const)));
  return DOC_SOURCES.flatMap((source) => sourceEntries(source, folderDocs(source, trees.get(source.repo))));
}
