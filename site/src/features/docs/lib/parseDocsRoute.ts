import { DOC_SOURCES } from '@/features/docs/DocsConfig.ts';
import type { DocsRoute } from '@/features/docs/DocsTypes.ts';
import { DOCS_ROUTE } from '@/shared/LinksConfig.ts';

export function parseDocsRoute(hash: string): DocsRoute | undefined {
  const rest = decodeURIComponent(hash.slice(DOCS_ROUTE.length)).replace(/^\/+/u, '');
  const separator = rest.indexOf('/');
  const sourceKey = separator === -1 ? rest : rest.slice(0, separator);
  const path = separator === -1 ? '' : rest.slice(separator + 1);
  const source = sourceKey === '' ? DOC_SOURCES[0] : DOC_SOURCES.find((candidate) => candidate.key === sourceKey);
  if (source === undefined) return undefined;
  return { source, path: path === '' ? (source.files[0] ?? '') : path };
}
