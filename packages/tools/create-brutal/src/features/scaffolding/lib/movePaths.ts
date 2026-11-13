import { existsSync, mkdirSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';

export function movePaths(dir: string, moves: Record<string, string>): void {
  for (const [from, to] of Object.entries(moves)) {
    if (!existsSync(join(dir, from))) throw new Error(`nothing to move at ${from}`);
    mkdirSync(dirname(join(dir, to)), { recursive: true });
    renameSync(join(dir, from), join(dir, to));
  }
}
