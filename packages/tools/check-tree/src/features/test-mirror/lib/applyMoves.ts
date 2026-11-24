import { existsSync, mkdirSync, readdirSync, renameSync, rmdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { FileMove } from '#src/shared/violations/ViolationTypes.ts';

function dropEmptyParents(folder: string, keep: ReadonlySet<string>): void {
  if (keep.has(folder) || !existsSync(folder) || readdirSync(folder).length > 0) return;
  rmdirSync(folder);
  dropEmptyParents(dirname(folder), keep);
}

export function applyMoves(
  base: string,
  moves: readonly FileMove[],
  keep: readonly string[],
): FileMove[] {
  const kept = new Set([base, ...keep.map((folder) => join(base, folder))]);
  return moves.filter(({ from, to }) => {
    const source = join(base, from);
    const target = join(base, to);
    if (!existsSync(source) || existsSync(target)) return false;
    mkdirSync(dirname(target), { recursive: true });
    renameSync(source, target);
    dropEmptyParents(dirname(source), kept);
    return true;
  });
}
