import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fixedEntries, loadDocList } from '@/features/docs/lib/docList.ts';
import { readCachedList } from '@/features/docs/lib/docsStorage.ts';

function memoryStorage(): Pick<Storage, 'getItem' | 'setItem'> {
  const items = new Map<string, string>();
  return { getItem: (key) => items.get(key) ?? null, setItem: (key, value) => void items.set(key, value) };
}

function folderAnswer(url: string): Response {
  const directory = /contents\/(.*)\?ref=main$/u.exec(url)?.[1] ?? '';
  return new Response(JSON.stringify([{ type: 'file', path: `${directory}/guide.md` }]));
}

describe('docList', () => {
  beforeEach(() => {
    vi.stubGlobal('sessionStorage', memoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts from the files every source names, with their titles', () => {
    expect(fixedEntries().filter((entry) => entry.sourceKey === 'vite')).toStrictEqual([
      { sourceKey: 'vite', path: 'README.md', title: 'Overview' },
      { sourceKey: 'vite', path: 'CHANGELOG.md', title: 'Changelog' },
    ]);
  });

  it('adds the folder files and keeps the complete list for the session', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<(url: string) => Promise<Response>>(async (url: string) => folderAnswer(url)),
    );
    const entries = await loadDocList(new AbortController().signal);
    expect(entries.filter((entry) => entry.sourceKey === 'vite').map((entry) => entry.path)).toStrictEqual(['README.md', 'docs/guide.md', 'CHANGELOG.md']);
    expect(readCachedList()).toStrictEqual(entries);
  });

  it('shows a partial list without keeping it when a folder fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<(url: string) => Promise<Response>>(async (url: string) => (url.includes('templates/vite') ? new Response('', { status: 500 }) : folderAnswer(url))),
    );
    const entries = await loadDocList(new AbortController().signal);
    expect(entries.filter((entry) => entry.sourceKey === 'vite').map((entry) => entry.path)).toStrictEqual(['README.md', 'CHANGELOG.md']);
    expect(entries.some((entry) => entry.path === 'docs/guide.md')).toBe(true);
    expect(readCachedList()).toBeUndefined();
  });
});
