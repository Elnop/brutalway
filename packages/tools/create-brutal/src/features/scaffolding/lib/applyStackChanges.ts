import { cpSync, existsSync, globSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { applyFileEdit } from '#src/features/scaffolding/lib/applyFileEdit.ts';
import { errorMessage } from '#src/shared/lib/errorMessage.ts';
import { formatJson } from '#src/features/scaffolding/lib/formatJson.ts';
import { isRecord } from '#src/shared/lib/isRecord.ts';
import { PROJECT_NAME_TOKEN } from '#src/features/scaffolding/ScaffoldConfig.ts';
import type { PackageJson } from '#src/features/scaffolding/ScaffoldTypes.ts';
import type { Answers, FileEdit, Stack, StackChange } from '#src/shared-features/stack/StackTypes.ts';

function matches(change: StackChange, answers: Answers): boolean {
  return Object.entries(change.when).every(([id, value]) => answers[id] === value);
}

function removePaths(dir: string, patterns: string[]): void {
  for (const pattern of patterns) {
    const found = globSync(pattern, { cwd: dir });
    if (found.length === 0) throw new Error(`nothing matches ${pattern}`);
    for (const path of found) rmSync(join(dir, path), { recursive: true, force: true });
  }
}

function withProjectName(edit: FileEdit, projectName: string): FileEdit {
  if ('with' in edit) return { ...edit, with: edit.with.replaceAll(PROJECT_NAME_TOKEN, projectName) };
  if ('insert' in edit) return { ...edit, insert: edit.insert.replaceAll(PROJECT_NAME_TOKEN, projectName) };
  return edit;
}

function editFiles(dir: string, edits: FileEdit[], projectName: string): void {
  for (const edit of edits) {
    const path = join(dir, edit.file);
    if (!existsSync(path)) throw new Error(`${edit.file} does not exist`);
    const named = withProjectName(edit, projectName);
    try {
      writeFileSync(path, applyFileEdit(readFileSync(path, 'utf8'), named));
    } catch (error) {
      throw new Error(`${edit.file}: ${errorMessage(error)}`, { cause: error });
    }
  }
}

function sortedRecord(record: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(record).toSorted(([a], [b]) => a.localeCompare(b)));
}

export function updatePackageJson(dir: string, update: (pkg: PackageJson) => void): void {
  const path = join(dir, 'package.json');
  const pkg: unknown = JSON.parse(readFileSync(path, 'utf8'));
  if (!isRecord(pkg)) throw new Error('package.json is not an object');
  update(pkg);
  writeFileSync(path, `${JSON.stringify(pkg, null, 2)}\n`);
}

function changesPackage(change: StackChange): boolean {
  return [change.removeScripts, change.removeDependencies, change.addDependencies, change.addDevDependencies].some((field) => field !== undefined);
}

function updatePackage(dir: string, change: StackChange): void {
  updatePackageJson(dir, (pkg) => {
    for (const script of change.removeScripts ?? []) {
      if (pkg.scripts?.[script] === undefined) throw new Error(`package.json has no script ${script}`);
      delete pkg.scripts[script];
    }
    for (const name of change.removeDependencies ?? []) {
      const field = pkg.dependencies?.[name] === undefined ? pkg.devDependencies : pkg.dependencies;
      if (field?.[name] === undefined) throw new Error(`package.json has no dependency ${name}`);
      delete field[name];
    }
    if (change.addDependencies !== undefined) pkg.dependencies = sortedRecord({ ...pkg.dependencies, ...change.addDependencies });
    if (change.addDevDependencies !== undefined) pkg.devDependencies = sortedRecord({ ...pkg.devDependencies, ...change.addDevDependencies });
  });
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
      writeFileSync(target, readFileSync(target, 'utf8').replaceAll(PROJECT_NAME_TOKEN, projectName));
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

export function applyStackChanges(dir: string, stack: Stack, answers: Answers, overlaysRoot: string, projectName: string): void {
  for (const change of stack.changes.filter((candidate) => matches(candidate, answers))) {
    removePaths(dir, change.remove ?? []);
    editFiles(dir, change.edits ?? [], projectName);
    if (changesPackage(change)) updatePackage(dir, change);
    if (change.overlay !== undefined) copyOverlay(join(overlaysRoot, stack.id, change.overlay), dir, projectName);
    keepFolders(dir, change.keep ?? []);
  }
  for (const file of ['knip.json', ...globSync('tsconfig*.json', { cwd: dir })]) {
    const path = join(dir, file);
    if (existsSync(path)) writeFileSync(path, formatJson(readFileSync(path, 'utf8'), file));
  }
  updatePackageJson(dir, (pkg) => {
    pkg['name'] = projectName;
    if (stack.projectVersion === undefined) delete pkg['version'];
    else pkg['version'] = stack.projectVersion;
  });
}
