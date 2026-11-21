import { spawnSync } from 'node:child_process';
import { runCommand } from '#src/shared/command/runCommand.ts';

export function git(cwd: string, args: string[]): string {
  return runCommand('git', args, cwd, true);
}

export function tryGit(cwd: string, args: string[]): { status: number; stderr: string } {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  return { status: result.status ?? 1, stderr: result.stderr };
}

export function gitLines(cwd: string, args: string[]): string[] {
  return git(cwd, args)
    .split('\n')
    .filter((line) => line !== '');
}
