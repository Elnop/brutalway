import { existsSync, globSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { dropStaleGitkeeps } from '#src/features/scaffolding/lib/dropStaleGitkeeps.ts';
import { formatJson } from '#src/features/scaffolding/lib/formatJson.ts';
import { updatePackageJson } from '#src/features/scaffolding/lib/updatePackageJson.ts';
import type { ScaffoldPlan } from '#src/features/scaffolding/ScaffoldTypes.ts';

export function finishProject(target: Pick<ScaffoldPlan, 'dir' | 'stack' | 'projectName'>): void {
  dropStaleGitkeeps(target.dir);
  for (const file of ['knip.json', ...globSync('tsconfig*.json', { cwd: target.dir })]) {
    const path = join(target.dir, file);
    if (existsSync(path)) writeFileSync(path, formatJson(readFileSync(path, 'utf8'), file));
  }
  updatePackageJson(target.dir, (pkg) => {
    pkg['name'] = target.projectName;
    if (target.stack.projectVersion === undefined) delete pkg['version'];
    else pkg['version'] = target.stack.projectVersion;
  });
}
