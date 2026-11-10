import { updatePackageJson } from '#src/features/scaffolding/lib/updatePackageJson.ts';
import type { StackChange } from '#src/shared-features/stack/StackTypes.ts';

function sortedRecord(record: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(record).toSorted(([a], [b]) => a.localeCompare(b)));
}

function changesPackage(change: StackChange): boolean {
  return [change.removeScripts, change.removeDependencies, change.addDependencies, change.addDevDependencies].some((field) => field !== undefined);
}

export function updatePackage(dir: string, change: StackChange): void {
  if (!changesPackage(change)) return;
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
