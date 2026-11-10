import {
  cpSync,
  existsSync,
  globSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { editFiles } from '#src/features/scaffolding/lib/editFiles.ts';
import { formatJson } from '#src/features/scaffolding/lib/formatJson.ts';
import { updatePackage } from '#src/features/scaffolding/lib/updatePackage.ts';
import { updatePackageJson } from '#src/features/scaffolding/lib/updatePackageJson.ts';
import { PROJECT_NAME_TOKEN } from '#src/features/scaffolding/ScaffoldConfig.ts';
import type { ScaffoldPlan } from '#src/features/scaffolding/ScaffoldTypes.ts';

function formatJsonFiles(dir: string): void {
  for (const file of ['knip.json', ...globSync('tsconfig*.json', { cwd: dir })]) {
    const path = join(dir, file);
    if (existsSync(path)) writeFileSync(path, formatJson(readFileSync(path, 'utf8'), file));
  }
}

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
      writeFileSync(
        target,
        readFileSync(target, 'utf8').replaceAll(PROJECT_NAME_TOKEN, projectName),
      );
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
  formatJsonFiles(target.dir);
  updatePackageJson(target.dir, (pkg) => {
    pkg['name'] = target.projectName;
    if (target.stack.projectVersion === undefined) delete pkg['version'];
    else pkg['version'] = target.stack.projectVersion;
  });
}
