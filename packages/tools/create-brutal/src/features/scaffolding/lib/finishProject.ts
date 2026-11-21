import { existsSync, globSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { dropEmptyFolders } from '#src/features/scaffolding/lib/dropEmptyFolders.ts';
import { dropStaleGitkeeps } from '#src/features/scaffolding/lib/dropStaleGitkeeps.ts';
import { formatJson } from '#src/features/scaffolding/lib/formatJson.ts';
import { updatePackageJson } from '#src/features/scaffolding/lib/updatePackageJson.ts';
import type { ScaffoldPlan } from '#src/features/scaffolding/ScaffoldTypes.ts';
import { ownVersion } from '#src/features/scaffolding/lib/ownVersion.ts';
import { STATE_SCHEMA_VERSION } from '#src/shared/stack/StateConfig.ts';
import { writeState } from '#src/shared/stack/lib/writeState.ts';

export function finishProject(
  target: Pick<ScaffoldPlan, 'dir' | 'stack' | 'answers' | 'projectName'>,
): void {
  dropStaleGitkeeps(target.dir);
  if (existsSync(join(target.dir, 'src'))) dropEmptyFolders(join(target.dir, 'src'));
  for (const file of ['knip.json', ...globSync('tsconfig*.json', { cwd: target.dir })]) {
    const path = join(target.dir, file);
    if (existsSync(path)) writeFileSync(path, formatJson(readFileSync(path, 'utf8'), file));
  }
  updatePackageJson(target.dir, (pkg) => {
    pkg['name'] = target.projectName;
    if (target.stack.projectVersion === undefined) delete pkg['version'];
    else pkg['version'] = target.stack.projectVersion;
  });
  writeState(target.dir, {
    schemaVersion: STATE_SCHEMA_VERSION,
    createBrutal: ownVersion(),
    stack: target.stack.id,
    projectName: target.projectName,
    options: target.answers,
  });
}
