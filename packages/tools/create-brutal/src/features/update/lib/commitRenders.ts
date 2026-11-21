import { cpSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { git } from '#src/features/update/lib/git.ts';
import { GIT_IDENTITY, MERGED_SEPARATELY } from '#src/features/update/UpdateConfig.ts';

function commitTree(repo: string, from: string, prefix: string, message: string): void {
  const target = join(repo, prefix);
  mkdirSync(target, { recursive: true });
  cpSync(from, target, {
    recursive: true,
    filter: (source) => !MERGED_SEPARATELY.includes(relative(from, source)),
  });
  git(repo, ['add', '--all', '--force']);
  git(repo, [...GIT_IDENTITY, 'commit', '--no-verify', '--allow-empty', '--quiet', '-m', message]);
}

export function commitRenders(
  repo: string,
  renders: { oldDir: string; newDir: string },
  prefix: string,
  message: string,
): boolean {
  mkdirSync(repo, { recursive: true });
  git(repo, ['init', '--quiet']);
  commitTree(repo, renders.oldDir, prefix, 'create-brutal: the project as first generated');
  git(repo, ['rm', '-r', '--quiet', '--ignore-unmatch', '.']);
  commitTree(repo, renders.newDir, prefix, message);
  return git(repo, ['diff', '--name-only', 'HEAD~1', 'HEAD']).trim() !== '';
}
