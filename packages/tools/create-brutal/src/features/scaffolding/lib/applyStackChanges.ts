import {
  cpSync,
  globSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { finishProject } from '#src/features/scaffolding/lib/finishProject.ts';
import { editFiles } from '#src/features/scaffolding/lib/editFiles.ts';
import { movePaths } from '#src/features/scaffolding/lib/movePaths.ts';
import { updatePackage } from '#src/features/scaffolding/lib/updatePackage.ts';
import { fillProjectTokens } from '#src/features/scaffolding/lib/fillProjectTokens.ts';
import type { ScaffoldPlan } from '#src/features/scaffolding/ScaffoldTypes.ts';

function removePaths(dir: string, patterns: string[]): void {
  for (const pattern of patterns) {
    const found = globSync(pattern, { cwd: dir });
    if (found.length === 0) throw new Error(`nothing matches ${pattern}`);
    for (const path of found) rmSync(join(dir, path), { recursive: true, force: true });
  }
}

function copyOverlay(from: string, to: string, projectName: string): void {
  for (const entry of readdirSync(from)) {
    const source = join(from, entry);
    const target = join(to, entry);
    if (statSync(source).isDirectory()) {
      mkdirSync(target, { recursive: true });
      copyOverlay(source, target, projectName);
    } else {
      cpSync(source, target);
      writeFileSync(target, fillProjectTokens(readFileSync(target, 'utf8'), projectName));
    }
  }
}

function keepFolders(dir: string, folders: string[]): void {
  for (const folder of folders) {
    const path = join(dir, folder);
    mkdirSync(path, { recursive: true });
    if (readdirSync(path).length === 0) writeFileSync(join(path, '.gitkeep'), '');
  }
}

type StackTarget = Pick<ScaffoldPlan, 'dir' | 'stack' | 'answers' | 'projectName'>;

export function applyStackChanges(target: StackTarget, overlaysRoot: string): void {
  const changes = target.stack.changes.filter((change) =>
    Object.entries(change.when).every(([id, value]) => target.answers[id] === value),
  );
  for (const change of changes) {
    movePaths(target.dir, change.move ?? {});
    removePaths(target.dir, change.remove ?? []);
    editFiles(target.dir, change.edits ?? [], target.projectName);
    updatePackage(target.dir, change);
    if (change.overlay !== undefined) {
      copyOverlay(
        join(overlaysRoot, target.stack.id, change.overlay),
        target.dir,
        target.projectName,
      );
    }
    keepFolders(target.dir, change.keep ?? []);
  }
  finishProject(target);
}
