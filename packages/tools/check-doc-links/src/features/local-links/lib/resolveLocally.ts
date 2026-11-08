import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { LinkResult, ProjectContext } from './DocLinksTypes.ts';

const NPM_PAGE = /^https:\/\/(?:www\.)?npmjs\.com\/package\/((?:@[^/]+\/)?[^/?#]+)/iu;
const GITHUB_FILE = /^https:\/\/github\.com\/([^/]+\/[^/]+)\/(?:blob|tree)\/(?:main|master|HEAD)\/([^?#]*)/iu;

export function npmPackageName(url: string): string | undefined {
  const name = NPM_PAGE.exec(url)?.[1];
  return name === undefined ? undefined : decodeURIComponent(name);
}

export function resolveLocally(url: string, context: ProjectContext): LinkResult | undefined {
  const name = npmPackageName(url);
  if (name !== undefined && context.packages.has(name)) return { verdict: 'alive', reason: 'a package of this project' };
  const file = GITHUB_FILE.exec(url);
  if (file?.[1] === undefined || file[1].toLowerCase() !== context.repository) return undefined;
  const path = decodeURIComponent(file[2] ?? '');
  return existsSync(join(context.gitRoot, path)) ? { verdict: 'alive', reason: 'a file of this repository' } : { verdict: 'dead', reason: `no ${path === '' ? 'root' : path} in this repository` };
}
