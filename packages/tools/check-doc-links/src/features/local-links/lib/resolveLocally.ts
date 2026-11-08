import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ProjectContext } from '#src/features/local-links/LocalLinksTypes.ts';
import type { LinkResult } from '#src/shared-features/links/LinksTypes.ts';
import { npmPackageName } from '#src/shared-features/links/npmPackageName.ts';

const GITHUB_FILE = /^https:\/\/github\.com\/([^/]+\/[^/]+)\/(?:blob|tree)\/(?:main|master|HEAD)\/([^?#]*)/iu;

export function resolveLocally(url: string, context: ProjectContext): LinkResult | undefined {
  const name = npmPackageName(url);
  if (name !== undefined && context.packages.has(name)) return { verdict: 'alive', reason: 'a package of this project' };
  const file = GITHUB_FILE.exec(url);
  if (file?.[1] === undefined || file[1].toLowerCase() !== context.repository) return undefined;
  const path = decodeURIComponent(file[2] ?? '');
  return existsSync(join(context.gitRoot, path)) ? { verdict: 'alive', reason: 'a file of this repository' } : { verdict: 'dead', reason: `no ${path === '' ? 'root' : path} in this repository` };
}
