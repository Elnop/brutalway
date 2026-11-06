import { DOC_SOURCES } from '@/features/docs/DocsConfig.ts';
import type { DocsRoute } from '@/features/docs/DocsTypes.ts';

export function parseDocsRoute(hash: string): DocsRoute | undefined {
  const sources = DOC_SOURCES.filter((source) => hash === source.route || hash.startsWith(`${source.route}/`));
  const route = sources[0]?.route;
  if (route === undefined) return undefined;
  const rest = decodeURIComponent(hash.slice(route.length)).replace(/^\/+/u, '');
  const separator = rest.indexOf('/');
  const sourceKey = separator === -1 ? rest : rest.slice(0, separator);
  const path = separator === -1 ? '' : rest.slice(separator + 1);
  const source = sourceKey === '' ? sources[0] : sources.find((candidate) => candidate.key === sourceKey);
  if (source === undefined) return undefined;
  return { source, path: path === '' ? (source.files[0] ?? '') : path };
}
