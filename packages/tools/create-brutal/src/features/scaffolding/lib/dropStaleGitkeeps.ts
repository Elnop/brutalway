import { globSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

export function dropStaleGitkeeps(dir: string): void {
  for (const gitkeep of globSync('**/.gitkeep', { cwd: dir, exclude: ['node_modules/**'] })) {
    if (readdirSync(join(dir, dirname(gitkeep))).length > 1) rmSync(join(dir, gitkeep));
  }
}
