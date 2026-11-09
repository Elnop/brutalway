import { useQuery } from '@tanstack/react-query';
import { PACKAGES_INDEX } from '@/features/docs/DocsConfig.ts';
import type { DocEntry, DocSource, LoadState, PackageCategory } from '@/features/docs/DocsTypes.ts';
import { docsKeys } from '@/features/docs/docsKeys.ts';
import { fetchDocText } from '@/features/docs/githubClient.ts';
import { fixedEntries, loadDocList } from '@/features/docs/lib/docList.ts';
import { packageCategories } from '@/features/docs/lib/packageCategories.ts';
import { rawFileUrl } from '@/features/docs/lib/docsUrls.ts';
import { QUERY_CACHE } from '@/shared/configs/QueryConfig.ts';

export function useDocList(): DocEntry[] {
  const query = useQuery({ queryKey: docsKeys.list(), queryFn: async ({ signal }) => loadDocList(signal), ...QUERY_CACHE.session });
  return query.data ?? fixedEntries();
}

export function useDocContent(source: DocSource, path: string): LoadState<string> {
  const url = rawFileUrl(source, path);
  const query = useQuery({ queryKey: docsKeys.content(url), queryFn: async ({ signal }) => fetchDocText(url, signal), ...QUERY_CACHE.session });
  if (query.isPending) return { status: 'loading' };
  if (query.isError) return { status: 'error', message: query.error.message };
  return { status: 'ready', value: query.data };
}

export function usePackageCategories(enabled: boolean): PackageCategory[] {
  const url = rawFileUrl(PACKAGES_INDEX, PACKAGES_INDEX.files[0] ?? '');
  const query = useQuery({ queryKey: docsKeys.content(url), queryFn: async ({ signal }) => fetchDocText(url, signal), enabled, select: packageCategories, ...QUERY_CACHE.session });
  return query.data ?? [];
}
