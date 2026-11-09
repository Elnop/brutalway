import { DOC_SOURCES } from '@/features/docs/DocsConfig.ts';
import type { DocSource } from '@/features/docs/DocsTypes.ts';
import { docHref, githubFileUrl, rawFileUrl, repositoryPath } from '@/features/docs/lib/docsUrls.ts';

type DocLink = {
  url: string;
  attribute: string;
  source: DocSource;
  docPath: string;
  knownPaths: string[];
};

const ABSOLUTE_URL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/iu;

function pathInSource(source: DocSource, fullPath: string): string | undefined {
  if (source.directory === '' || fullPath === source.directory) return source.directory === '' ? fullPath : '';
  const prefix = `${source.directory}/`;
  return fullPath.startsWith(prefix) ? fullPath.slice(prefix.length) : undefined;
}

function pageHref(source: DocSource, fullPath: string, pages: string[]): string | undefined {
  const path = pathInSource(source, fullPath);
  if (path === undefined) return undefined;
  const page = path === '' ? source.files[0] : path;
  return page !== undefined && pages.includes(page) ? docHref(source, page) : undefined;
}

function fixedPages(source: DocSource): string[] {
  return [...source.files, ...(source.changelog === undefined ? [] : [source.changelog])];
}

function siteHref(source: DocSource, fullPath: string, knownPaths: string[]): string | undefined {
  const ownHref = pageHref(source, fullPath, knownPaths);
  if (ownHref !== undefined) return ownHref;
  for (const other of DOC_SOURCES) {
    const href = pageHref(other, fullPath, fixedPages(other));
    if (href !== undefined) return href;
  }
  return undefined;
}

export function resolveDocUrl({ url, attribute, source, docPath, knownPaths }: DocLink): string {
  if (ABSOLUTE_URL.test(url)) return url;
  if (url.startsWith('#')) return `${docHref(source, docPath)}${url}`;
  const resolved = new URL(url, `https://repository.invalid/${repositoryPath(source, docPath)}`);
  const fullPath = decodeURIComponent(resolved.pathname.slice(1)).replace(/\/+$/u, '');
  const repository = { ...source, directory: '' };
  if (attribute === 'src') return rawFileUrl(repository, fullPath);
  const href = siteHref(source, fullPath, knownPaths);
  return href === undefined ? `${githubFileUrl(repository, fullPath)}${resolved.hash}` : `${href}${resolved.hash}`;
}
