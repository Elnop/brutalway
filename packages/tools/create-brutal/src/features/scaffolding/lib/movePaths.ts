import { existsSync, mkdirSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { mirroredTests, movedTest } from '#src/features/scaffolding/lib/mirroredTests.ts';

function movePath(dir: string, from: string, to: string): void {
  mkdirSync(dirname(join(dir, to)), { recursive: true });
  renameSync(join(dir, from), join(dir, to));
}

export function movePaths(dir: string, moves: Record<string, string>): void {
  for (const [from, to] of Object.entries(moves)) {
    if (!existsSync(join(dir, from))) throw new Error(`nothing to move at ${from}`);
    const tests = mirroredTests(dir, from);
    movePath(dir, from, to);
    for (const test of tests) {
      const target = movedTest(test, from, to);
      if (target !== undefined) movePath(dir, test, target);
    }
  }
}
