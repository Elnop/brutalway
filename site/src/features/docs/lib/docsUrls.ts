import { DOCS_BRANCH } from '@/features/docs/DocsConfig.ts';
import type { DocSource } from '@/features/docs/DocsTypes.ts';

export function docHref(source: DocSource, path: string): string {
  return `${source.route}/${source.key}/${path}`;
}

export function rawFileUrl(repo: string, path: string): string {
  return `https://raw.githubusercontent.com/${repo}/${DOCS_BRANCH}/${path}`;
}

export function githubFileUrl(repo: string, path: string): string {
  return `https://github.com/${repo}/blob/${DOCS_BRANCH}/${path}`;
}

export function folderListUrl(repo: string, folder: string): string {
  return `https://api.github.com/repos/${repo}/contents/${folder}?ref=${DOCS_BRANCH}`;
}
