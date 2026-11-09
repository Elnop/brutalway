import type { DocSource } from '@/features/docs/DocsTypes.ts';
import { folderListUrl, sourcePath } from '@/features/docs/lib/docsUrls.ts';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isMarkdownFile(value: unknown): value is { type: 'file'; path: string } {
  return isRecord(value) && value['type'] === 'file' && typeof value['path'] === 'string' && value['path'].endsWith('.md');
}

function isFolder(value: unknown): value is { type: 'dir'; path: string } {
  return isRecord(value) && value['type'] === 'dir' && typeof value['path'] === 'string';
}

async function listFolderTree(source: DocSource, folder: string, signal: AbortSignal): Promise<string[] | undefined> {
  const response = await fetch(folderListUrl(source, folder), { signal });
  if (!response.ok) return undefined;
  const items: unknown = await response.json();
  if (!Array.isArray(items)) return undefined;
  const files = items.filter(isMarkdownFile).map((item) => sourcePath(source, item.path));
  const nested = await Promise.all(items.filter(isFolder).map(async (item) => listFolderTree(source, sourcePath(source, item.path), signal)));
  return nested.every((paths) => paths !== undefined) ? [...files, ...nested.flat()] : undefined;
}

export async function listMarkdownFiles(source: DocSource, signal: AbortSignal): Promise<string[] | undefined> {
  if (source.folder === undefined) return [];
  try {
    return await listFolderTree(source, source.folder, signal);
  } catch {
    return undefined;
  }
}

export async function fetchDocText(url: string, signal: AbortSignal): Promise<string> {
  const response = await fetch(url, { signal }).catch(() => {
    throw new Error('The page could not be loaded from GitHub.');
  });
  if (!response.ok) throw new Error(`GitHub answered ${String(response.status)}.`);
  return response.text();
}
