import { afterEach, describe, expect, it, vi } from 'vitest';
import { fixedEntries, loadDocList } from '@/features/docs/lib/docList.ts';

const REPOSITORY_FILES = [
  'README.md',
  'docs/concepts/intent.md',
  'docs/getting-started.md',
  'docs/notes.txt',
  'packages/tools/create-brutal/README.md',
  'templates/vite/README.md',
  'templates/vite/docs/architecture.md',
  'templates/vite/docs/guides/setup.md',
  'templates/vite/src/README.md',
];

function treeAnswer(): Response {
  return new Response(
    JSON.stringify({
      truncated: false,
      tree: REPOSITORY_FILES.map((path) => ({ type: 'blob', path })),
    }),
  );
}

function paths(entries: { sourceKey: string; path: string }[], sourceKey: string): string[] {
  return entries.filter((entry) => entry.sourceKey === sourceKey).map((entry) => entry.path);
}

describe('docList', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts from the files every source names, with their titles', () => {
    expect(fixedEntries().filter((entry) => entry.sourceKey === 'vite')).toStrictEqual([
      { sourceKey: 'vite', path: 'README.md', title: 'Overview' },
      { sourceKey: 'vite', path: 'CHANGELOG.md', title: 'Changelog' },
    ]);
  });

  it('adds the Markdown files the repository holds under each docs folder, and only those, in the order the source sets', async () => {
    const fetchMock = vi.fn<() => Promise<Response>>(async () => treeAnswer());
    vi.stubGlobal('fetch', fetchMock);
    const entries = await loadDocList(new AbortController().signal);
    expect(paths(entries, 'brutalway')).toStrictEqual([
      'README.md',
      'docs/getting-started.md',
      'packages/tools/create-brutal/README.md',
      'docs/concepts/intent.md',
      'CONTRIBUTING.md',
      'roadmap',
    ]);
    expect(paths(entries, 'vite')).toStrictEqual([
      'README.md',
      'docs/guides/setup.md',
      'docs/architecture.md',
      'CHANGELOG.md',
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('lists the roadmap of a source among its pages, without a file behind it', () => {
    expect(paths(fixedEntries(), 'brutalway')).toContain('roadmap');
  });

  it('keeps the named files when GitHub does not answer', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('', { status: 403 })),
    );
    expect(await loadDocList(new AbortController().signal)).toStrictEqual(fixedEntries());
  });
});
