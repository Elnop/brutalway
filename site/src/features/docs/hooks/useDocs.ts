import { queryOptions, useQueries, useQuery } from '@tanstack/react-query';
import { DOC_SOURCES, PACKAGES_INDEX } from '@/features/docs/DocsConfig.ts';
import type { DocEntry, DocSource, LoadState, PackageCategory } from '@/features/docs/DocsTypes.ts';
import { docsKeys } from '@/features/docs/docsKeys.ts';
import { fetchDocText, listIssues } from '@/features/docs/githubClient.ts';
import { docMainTitle } from '@/features/docs/lib/docHeadings.ts';
import { fixedEntries, loadDocList } from '@/features/docs/lib/docList.ts';
import { packageCategories } from '@/features/docs/lib/packageCategories.ts';
import { roadmapMarkdown } from '@/features/docs/lib/roadmapMarkdown.ts';
import { rawFileUrl } from '@/features/docs/lib/docsUrls.ts';
import { QUERY_CACHE } from '@/shared/configs/QueryConfig.ts';

export function useDocList(): DocEntry[] {
  const query = useQuery({ queryKey: docsKeys.list(), queryFn: async ({ signal }) => loadDocList(signal), ...QUERY_CACHE.session });
  return query.data ?? fixedEntries();
}

function roadmapQuery(repo: string) {
  return queryOptions({ queryKey: docsKeys.roadmap(repo), queryFn: async ({ signal }) => roadmapMarkdown(repo, await listIssues(repo, signal)), ...QUERY_CACHE.session });
}

function contentQuery(url: string) {
  return queryOptions({ queryKey: docsKeys.content(url), queryFn: async ({ signal }) => fetchDocText(url, signal), ...QUERY_CACHE.session });
}

export function useDocContent(source: DocSource, path: string): LoadState<string> {
  const query = useQuery(path === source.roadmap ? roadmapQuery(source.repo) : contentQuery(rawFileUrl(source, path)));
  if (query.isPending) return { status: 'loading' };
  if (query.isError) return { status: 'error', message: query.error.message };
  return { status: 'ready', value: query.data };
}

export function usePackageCategories(enabled: boolean): PackageCategory[] {
  const url = rawFileUrl(PACKAGES_INDEX, PACKAGES_INDEX.files[0] ?? '');
  const query = useQuery({ queryKey: docsKeys.content(url), queryFn: async ({ signal }) => fetchDocText(url, signal), enabled, select: packageCategories, ...QUERY_CACHE.session });
  return query.data ?? [];
}

export function useDocTitles(entries: DocEntry[], route: string): DocEntry[] {
  const pages = entries.flatMap((entry) => {
    const source = DOC_SOURCES.find((candidate) => candidate.key === entry.sourceKey);
    return source === undefined || source.route !== route || source.route === PACKAGES_INDEX.route || entry.path === source.changelog || entry.path === source.roadmap
      ? []
      : [{ entry, url: rawFileUrl(source, entry.path) }];
  });
  const titles = useQueries({
    queries: pages.map(({ url }) => ({ queryKey: docsKeys.content(url), queryFn: async ({ signal }: { signal: AbortSignal }) => fetchDocText(url, signal), ...QUERY_CACHE.session })),
    combine: (results) =>
      new Map(
        results.flatMap((result, index) => {
          const page = pages[index];
          const title = result.data === undefined ? undefined : docMainTitle(result.data);
          return page === undefined || title === undefined ? [] : [[`${page.entry.sourceKey}/${page.entry.path}`, title] as const];
        }),
      ),
  });
  return entries.map((entry) => ({ ...entry, title: titles.get(`${entry.sourceKey}/${entry.path}`) ?? entry.title }));
}
