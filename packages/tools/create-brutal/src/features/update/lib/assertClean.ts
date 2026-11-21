import { git } from '#src/features/update/lib/git.ts';

export function assertClean(projectDir: string): void {
  if (git(projectDir, ['status', '--porcelain']).trim() === '') return;
  throw new Error(
    'the working tree has changes: commit or stash them first, so that git can show and undo what the update changes',
  );
}
