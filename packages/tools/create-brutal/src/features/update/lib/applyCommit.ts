import { git, gitLines, tryGit } from '#src/features/update/lib/git.ts';

export function applyCommit(projectDir: string, repo: string): string[] {
  git(projectDir, ['fetch', '--quiet', '--no-tags', repo, 'HEAD']);
  const picked = tryGit(projectDir, ['cherry-pick', '--no-commit', 'FETCH_HEAD']);
  const conflicts = gitLines(projectDir, ['diff', '--name-only', '--diff-filter=U']);
  tryGit(projectDir, ['cherry-pick', '--quit']);
  if (picked.status !== 0 && conflicts.length === 0) {
    throw new Error(`git cherry-pick failed: ${picked.stderr}`);
  }
  return conflicts;
}
