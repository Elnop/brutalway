import { useEffect, useState } from 'react';
import { DOC_SOURCES } from '@/features/docs/DocsConfig.ts';
import type { DocEntry, DocSource, LoadState } from '@/features/docs/DocsTypes.ts';
import { docTitle } from '@/features/docs/lib/docTitle.ts';
import { folderListUrl, rawFileUrl, sourcePath } from '@/features/docs/lib/docsUrls.ts';

const LIST_CACHE_KEY = 'brutal-docs-list-v3';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isDocEntry(value: unknown): value is DocEntry {
  return isRecord(value) && typeof value['sourceKey'] === 'string' && typeof value['path'] === 'string' && typeof value['title'] === 'string';
}

function isMarkdownFile(value: unknown): value is { type: 'file'; path: string } {
  return isRecord(value) && value['type'] === 'file' && typeof value['path'] === 'string' && value['path'].endsWith('.md');
}

function toEntry(sourceKey: string, path: string): DocEntry {
  return { sourceKey, path, title: docTitle(path) };
}

function sourceEntries(source: DocSource, folderPaths: string[]): DocEntry[] {
  const paths = [...source.files, ...folderPaths, ...(source.changelog === undefined ? [] : [source.changelog])];
  return paths.map((path) => toEntry(source.key, path));
}

function fixedEntries(): DocEntry[] {
  return DOC_SOURCES.flatMap((source) => sourceEntries(source, []));
}

function readCachedList(): DocEntry[] | undefined {
  try {
    const cached = sessionStorage.getItem(LIST_CACHE_KEY);
    if (cached === null) return undefined;
    const parsed: unknown = JSON.parse(cached);
    return Array.isArray(parsed) && parsed.every(isDocEntry) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function writeCachedList(entries: DocEntry[]): void {
  try {
    sessionStorage.setItem(LIST_CACHE_KEY, JSON.stringify(entries));
  } catch {
    return;
  }
}

async function listFolder(source: DocSource, signal: AbortSignal): Promise<string[] | undefined> {
  if (source.folder === undefined) return [];
  try {
    const response = await fetch(folderListUrl(source, source.folder), { signal });
    if (!response.ok) return undefined;
    const items: unknown = await response.json();
    return Array.isArray(items) ? items.filter(isMarkdownFile).map((item) => sourcePath(source, item.path)) : undefined;
  } catch {
    return undefined;
  }
}

async function listAll(signal: AbortSignal): Promise<{ entries: DocEntry[]; complete: boolean }> {
  const folders = await Promise.all(DOC_SOURCES.map((source) => listFolder(source, signal)));
  const entries = DOC_SOURCES.flatMap((source, index) => sourceEntries(source, folders[index] ?? []));
  return { entries, complete: folders.every((folder) => folder !== undefined) };
}

export function useDocList(): DocEntry[] {
  const [entries, setEntries] = useState<DocEntry[]>(() => readCachedList() ?? fixedEntries());
  useEffect(() => {
    if (readCachedList() !== undefined) return undefined;
    const controller = new AbortController();
    async function load(): Promise<void> {
      const { entries: all, complete } = await listAll(controller.signal);
      if (controller.signal.aborted) return;
      if (complete) writeCachedList(all);
      setEntries(all);
    }
    void load();
    return () => controller.abort();
  }, []);
  return entries;
}

export function useDocContent(source: DocSource, path: string): LoadState<string> {
  const url = rawFileUrl(source, path);
  const [loaded, setLoaded] = useState<{ url: string; state: LoadState<string> } | undefined>(undefined);
  useEffect(() => {
    const controller = new AbortController();
    async function load(): Promise<void> {
      try {
        const response = await fetch(url, { signal: controller.signal });
        const state: LoadState<string> = response.ok ? { status: 'ready', value: await response.text() } : { status: 'error', message: `GitHub answered ${String(response.status)}.` };
        if (!controller.signal.aborted) setLoaded({ url, state });
      } catch {
        if (!controller.signal.aborted) setLoaded({ url, state: { status: 'error', message: 'The page could not be loaded from GitHub.' } });
      }
    }
    void load();
    return () => controller.abort();
  }, [url]);
  return loaded?.url === url ? loaded.state : { status: 'loading' };
}
