import { afterEach, describe, expect, it, vi } from 'vitest';
import { DOC_SOURCES } from '@/features/docs/DocsConfig.ts';
import { fetchDocText, listMarkdownFiles } from '@/features/docs/githubClient.ts';

const [brutalway, templates, vite] = DOC_SOURCES;

function answer(body: unknown, status = 200): Response {
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), { status });
}

describe('githubClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('lists the Markdown files of a folder and its subfolders, relative to the source directory', async () => {
    const fetchMock = vi.fn<(url: string) => Promise<Response>>(async (url: string) => {
      if (url === 'https://api.github.com/repos/Elnop/brutalway/contents/templates/vite/docs?ref=main') {
        return answer([
          { type: 'file', path: 'templates/vite/docs/intent.md' },
          { type: 'file', path: 'templates/vite/docs/logo.png' },
          { type: 'dir', path: 'templates/vite/docs/guides' },
        ]);
      }
      return answer([{ type: 'file', path: 'templates/vite/docs/guides/setup.md' }]);
    });
    vi.stubGlobal('fetch', fetchMock);
    await expect(listMarkdownFiles(vite, new AbortController().signal)).resolves.toStrictEqual(['docs/intent.md', 'docs/guides/setup.md']);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('lists nothing without a folder, and gives up when GitHub fails anywhere in the tree', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => answer({ message: 'rate limited' }, 403)),
    );
    await expect(listMarkdownFiles(templates, new AbortController().signal)).resolves.toStrictEqual([]);
    await expect(listMarkdownFiles(brutalway, new AbortController().signal)).resolves.toBeUndefined();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    await expect(listMarkdownFiles(brutalway, new AbortController().signal)).resolves.toBeUndefined();
  });

  it('reads a raw file, and turns a failure into the message shown on the page', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => answer('# Title')),
    );
    await expect(fetchDocText('https://raw.example/a.md', new AbortController().signal)).resolves.toBe('# Title');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => answer('missing', 404)),
    );
    await expect(fetchDocText('https://raw.example/a.md', new AbortController().signal)).rejects.toThrow('GitHub answered 404.');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    await expect(fetchDocText('https://raw.example/a.md', new AbortController().signal)).rejects.toThrow('The page could not be loaded from GitHub.');
  });
});
