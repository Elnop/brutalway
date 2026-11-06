import { DOCS_BRANCH } from '@/features/docs/DocsConfig.ts';
import { DOCS_ROUTE } from '@/shared/LinksConfig.ts';

export function docHref(sourceKey: string, path: string): string {
  return `${DOCS_ROUTE}/${sourceKey}/${path}`;
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
