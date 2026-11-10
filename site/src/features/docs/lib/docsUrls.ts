import type { DocSource } from '@/features/docs/DocsTypes.ts';
import { githubFileUrl } from '@/features/docs/lib/githubUrls.ts';

export function docHref(source: DocSource, path: string): string {
  return `${source.route}/${source.key}/${path}`;
}

export function sourcePath(source: DocSource, path: string): string {
  const prefix = source.directory === '' ? '' : `${source.directory}/`;
  return path.startsWith(prefix) ? path.slice(prefix.length) : path;
}

export function docSourceUrl(source: DocSource, path: string): string {
  return path === source.roadmap ? `https://github.com/${source.repo}/issues` : githubFileUrl(source, path);
}
