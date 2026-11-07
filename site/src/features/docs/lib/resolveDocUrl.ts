import type { DocSource } from '@/features/docs/DocsTypes.ts';
import { docHref, githubFileUrl, rawFileUrl } from '@/features/docs/lib/docsUrls.ts';

type DocLink = {
  url: string;
  attribute: string;
  source: DocSource;
  docPath: string;
  knownPaths: string[];
};

const ABSOLUTE_URL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/iu;

export function resolveDocUrl({ url, attribute, source, docPath, knownPaths }: DocLink): string {
  if (ABSOLUTE_URL.test(url)) return url;
  if (url.startsWith('#')) return `${githubFileUrl(source, docPath)}${url}`;
  const resolved = new URL(url, `https://repository.invalid/${docPath}`);
  const path = decodeURIComponent(resolved.pathname.slice(1));
  if (attribute === 'src') return rawFileUrl(source, path);
  if (knownPaths.includes(path)) return docHref(source, path);
  return `${githubFileUrl(source, path)}${resolved.hash}`;
}
