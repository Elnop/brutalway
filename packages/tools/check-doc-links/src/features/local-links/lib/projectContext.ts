import { execFileSync } from 'node:child_process';
import { existsSync, globSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ProjectContext } from '#src/features/local-links/LocalLinksTypes.ts';

function git(cwd: string, args: string[]): string | undefined {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return undefined;
  }
}

function manifest(path: string): Record<string, unknown> {
  if (!existsSync(path)) return {};
  const parsed: unknown = JSON.parse(readFileSync(path, 'utf8'));
  return typeof parsed === 'object' && parsed !== null ? { ...parsed } : {};
}

function packageNames(cwd: string): Set<string> {
  const root = manifest(join(cwd, 'package.json'));
  const workspaces = Array.isArray(root['workspaces'])
    ? root['workspaces'].filter((pattern) => typeof pattern === 'string')
    : [];
  const manifests = [
    root,
    ...workspaces
      .flatMap((pattern) => globSync(`${pattern}/package.json`, { cwd }))
      .map((path) => manifest(join(cwd, path))),
  ];
  return new Set(
    manifests.flatMap((entry) => (typeof entry['name'] === 'string' ? [entry['name']] : [])),
  );
}

export function githubRepository(remote: string | undefined): string | undefined {
  return /github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?$/iu.exec(remote ?? '')?.[1]?.toLowerCase();
}

export function projectContext(cwd: string): ProjectContext {
  return {
    gitRoot: git(cwd, ['rev-parse', '--show-toplevel']) ?? cwd,
    repository: githubRepository(git(cwd, ['remote', 'get-url', 'origin'])),
    packages: packageNames(cwd),
  };
}
