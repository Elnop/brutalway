import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchDocText, listIssues, listRepositoryFiles } from '@/features/docs/githubClient.ts';

function answer(body: unknown, status = 200): Response {
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), { status });
}

describe('githubClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('lists every file of the repository in one request to the tree of main', async () => {
    const fetchMock = vi.fn<(url: string) => Promise<Response>>(async () =>
      answer({
        truncated: false,
        tree: [
          { type: 'blob', path: 'README.md' },
          { type: 'tree', path: 'docs' },
          { type: 'blob', path: 'docs/roadmap.md' },
        ],
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    await expect(listRepositoryFiles('Elnop/brutalway', new AbortController().signal)).resolves.toStrictEqual(['README.md', 'docs/roadmap.md']);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.github.com/repos/Elnop/brutalway/git/trees/main?recursive=1');
  });

  it('gives up on an error, a truncated tree or no network', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => answer({ message: 'rate limited' }, 403)),
    );
    await expect(listRepositoryFiles('Elnop/brutalway', new AbortController().signal)).resolves.toBeUndefined();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => answer({ truncated: true, tree: [] })),
    );
    await expect(listRepositoryFiles('Elnop/brutalway', new AbortController().signal)).resolves.toBeUndefined();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    await expect(listRepositoryFiles('Elnop/brutalway', new AbortController().signal)).resolves.toBeUndefined();
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

  it('reads every page of issues, drops the pull requests and keeps what the roadmap needs', async () => {
    const issue = {
      number: 3,
      title: 'T',
      html_url: 'https://github.com/o/r/issues/3',
      state: 'closed',
      state_reason: 'completed',
      labels: [{ name: 'bug' }],
      parent_issue_url: 'https://api.github.com/repos/o/r/issues/2',
    };
    const firstPage = [issue, ...Array.from({ length: 99 }, (_, index) => ({ ...issue, number: index + 100, pull_request: {} }))];
    const fetchMock = vi.fn<(url: string) => Promise<Response>>(async (url) =>
      answer(url.endsWith('page=1') ? firstPage : [{ ...issue, number: 4, state: 'open', state_reason: null, labels: [], parent_issue_url: null }]),
    );
    vi.stubGlobal('fetch', fetchMock);
    await expect(listIssues('o/r', new AbortController().signal)).resolves.toStrictEqual([
      { number: 3, title: 'T', url: 'https://github.com/o/r/issues/3', closed: true, completed: true, labels: ['bug'], parent: 2 },
      { number: 4, title: 'T', url: 'https://github.com/o/r/issues/3', closed: false, completed: false, labels: [], parent: undefined },
    ]);
    expect(fetchMock.mock.calls.map(([url]) => url)).toStrictEqual([
      'https://api.github.com/repos/o/r/issues?state=all&per_page=100&page=1',
      'https://api.github.com/repos/o/r/issues?state=all&per_page=100&page=2',
    ]);
  });

  it('turns a failure to read the issues into the message shown on the page', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => answer({ message: 'rate limited' }, 403)),
    );
    await expect(listIssues('o/r', new AbortController().signal)).rejects.toThrow('GitHub answered 403.');
  });
});
