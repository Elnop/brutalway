import { queryOptions } from '@tanstack/react-query';
import { docsKeys } from '@/features/docs/docsKeys.ts';
import { fetchDocText, listIssues } from '@/features/docs/githubClient.ts';
import { roadmapMarkdown } from '@/features/docs/lib/roadmapMarkdown.ts';
import { QUERY_CACHE } from '@/shared/configs/QueryConfig.ts';

export function roadmapQuery(repo: string) {
  return queryOptions({
    queryKey: docsKeys.roadmap(repo),
    queryFn: async ({ signal }) => roadmapMarkdown(repo, await listIssues(repo, signal)),
    ...QUERY_CACHE.session,
  });
}

export function contentQuery(url: string) {
  return queryOptions({
    queryKey: docsKeys.content(url),
    queryFn: async ({ signal }) => fetchDocText(url, signal),
    ...QUERY_CACHE.session,
  });
}
