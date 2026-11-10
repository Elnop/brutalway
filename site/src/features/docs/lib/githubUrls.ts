import { DOCS_BRANCH } from '@/features/docs/DocsConfig.ts';
import type { DocSource } from '@/features/docs/DocsTypes.ts';

export function repositoryPath(source: DocSource, path: string): string {
  return source.directory === '' ? path : `${source.directory}/${path}`;
}

export function rawFileUrl(source: DocSource, path: string): string {
  return `https://raw.githubusercontent.com/${source.repo}/${DOCS_BRANCH}/${repositoryPath(source, path)}`;
}

export function githubFileUrl(source: DocSource, path: string): string {
  return `https://github.com/${source.repo}/blob/${DOCS_BRANCH}/${repositoryPath(source, path)}`;
}

export function repositoryTreeUrl(repo: string): string {
  return `https://api.github.com/repos/${repo}/git/trees/${DOCS_BRANCH}?recursive=1`;
}

export function issuesUrl(repo: string, page: number): string {
  return `https://api.github.com/repos/${repo}/issues?state=all&per_page=100&page=${String(page)}`;
}
