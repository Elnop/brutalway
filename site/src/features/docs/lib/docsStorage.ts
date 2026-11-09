import type { DocEntry } from '@/features/docs/DocsTypes.ts';

const LIST_CACHE_KEY = 'brutal-docs-list-v4';

function isDocEntry(value: unknown): value is DocEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    'sourceKey' in value &&
    typeof value.sourceKey === 'string' &&
    'path' in value &&
    typeof value.path === 'string' &&
    'title' in value &&
    typeof value.title === 'string'
  );
}

export function readCachedList(): DocEntry[] | undefined {
  try {
    const cached = sessionStorage.getItem(LIST_CACHE_KEY);
    if (cached === null) return undefined;
    const parsed: unknown = JSON.parse(cached);
    return Array.isArray(parsed) && parsed.every(isDocEntry) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function writeCachedList(entries: DocEntry[]): void {
  try {
    sessionStorage.setItem(LIST_CACHE_KEY, JSON.stringify(entries));
  } catch {
    return;
  }
}
