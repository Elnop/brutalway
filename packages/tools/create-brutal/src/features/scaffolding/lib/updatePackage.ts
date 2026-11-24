import { updatePackageJson } from '#src/features/scaffolding/lib/updatePackageJson.ts';
import type { StackChange } from '#src/shared/stack/StackTypes.ts';
import type { PackageJson } from '#src/features/scaffolding/ScaffoldTypes.ts';

function sortedRecord(record: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(record).toSorted(([a], [b]) => a.localeCompare(b)));
}

function changesPackage(change: StackChange): boolean {
  return [
    change.removeScripts,
    change.removePackageFields,
    change.removeDependencies,
    change.addDependencies,
    change.addDevDependencies,
  ].some((field) => field !== undefined);
}

function removeFields(pkg: PackageJson, change: StackChange): void {
  for (const script of change.removeScripts ?? []) {
    if (pkg.scripts?.[script] === undefined) {
      throw new Error(`package.json has no script ${script}`);
    }
    delete pkg.scripts[script];
  }
  for (const field of change.removePackageFields ?? []) {
    if (pkg[field] === undefined) throw new Error(`package.json has no field ${field}`);
    delete pkg[field];
  }
}

export function updatePackage(dir: string, change: StackChange): void {
  if (!changesPackage(change)) return;
  updatePackageJson(dir, (pkg) => {
    removeFields(pkg, change);
    for (const name of change.removeDependencies ?? []) {
      const field = pkg.dependencies?.[name] === undefined ? pkg.devDependencies : pkg.dependencies;
      if (field?.[name] === undefined) throw new Error(`package.json has no dependency ${name}`);
      delete field[name];
    }
    if (change.addDependencies !== undefined) {
      pkg.dependencies = sortedRecord({ ...pkg.dependencies, ...change.addDependencies });
    }
    if (change.addDevDependencies !== undefined) {
      pkg.devDependencies = sortedRecord({ ...pkg.devDependencies, ...change.addDevDependencies });
    }
  });
}
