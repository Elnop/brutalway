import { DOC_SOURCES } from '@/features/docs/DocsConfig.ts';
import type { DocsRoute } from '@/features/docs/DocsTypes.ts';

type SourcePath = { source: DocsRoute['source']; path: string };

function splitSection(fullHash: string): { hash: string; section: string } {
  const sectionStart = fullHash.indexOf('#', 1);
  return sectionStart === -1
    ? { hash: fullHash, section: '' }
    : {
        hash: fullHash.slice(0, sectionStart),
        section: decodeURIComponent(fullHash.slice(sectionStart + 1)),
      };
}

function splitSourceKey(rest: string): { sourceKey: string; path: string } {
  const separator = rest.indexOf('/');
  return separator === -1
    ? { sourceKey: rest, path: '' }
    : { sourceKey: rest.slice(0, separator), path: rest.slice(separator + 1) };
}

function findSource(hash: string): SourcePath | undefined {
  const sources = DOC_SOURCES.filter(
    (source) => hash === source.route || hash.startsWith(`${source.route}/`),
  );
  const route = sources[0]?.route;
  if (route === undefined) return undefined;
  const { sourceKey, path } = splitSourceKey(
    decodeURIComponent(hash.slice(route.length)).replace(/^\/+/u, ''),
  );
  const source =
    sourceKey === '' ? sources[0] : sources.find((candidate) => candidate.key === sourceKey);
  return source === undefined ? undefined : { source, path };
}

export function parseDocsRoute(fullHash: string): DocsRoute | undefined {
  const { hash, section } = splitSection(fullHash);
  const found = findSource(hash);
  if (found === undefined) return undefined;
  const requested = found.path === '' ? (found.source.files[0] ?? '') : found.path;
  const page = { source: found.source, path: found.source.moved?.[requested] ?? requested };
  return section === '' ? page : { ...page, section };
}
