import { CODE_FILES, DIRECTIVE_PATTERN } from '#src/features/snapshots/SnapshotConfig.ts';
import { git } from '#src/features/snapshots/lib/git.ts';

export function directiveLines(cwd: string, where: '--untracked' | { commit: string }): string[] {
  const [option, revision] = where === '--untracked' ? [[where], []] : [[], [where.commit]];
  const output =
    git(cwd, [
      'grep',
      ...option,
      '-h',
      '-o',
      '-I',
      '-E',
      DIRECTIVE_PATTERN,
      ...revision,
      '--',
      ...CODE_FILES,
    ]) ?? '';
  return output.split('\n').filter((line) => line !== '');
}
