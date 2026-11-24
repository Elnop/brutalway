import { checkedPaths } from '#src/features/shared-consumers/lib/checkedPaths.ts';
import { sharedFeatureOf } from '#src/features/shared-consumers/lib/sharedFeatureOf.ts';
import { variantLinks } from '#src/features/shared-consumers/lib/variantLinks.ts';
import type { ImportedModule } from '#src/features/shared-consumers/SharedConsumersTypes.ts';
import type { Violation } from '#src/shared/violations/ViolationTypes.ts';

function sharedFeatureFolders(
  root: string,
  modules: readonly ImportedModule[],
): Map<string, string> {
  const folders = new Map<string, string>();
  for (const { source } of modules) {
    const sharedFeature = sharedFeatureOf(source);
    if (sharedFeature !== undefined && source.startsWith(`${root}/`)) {
      folders.set(source, sharedFeature.folder);
    }
  }
  return folders;
}

function importLinks(
  modules: readonly ImportedModule[],
  folders: ReadonlyMap<string, string>,
): [string, string][] {
  return modules.flatMap(({ source, imports }) =>
    imports
      .filter((target) => folders.has(source) && folders.get(target) === folders.get(source))
      .map((target): [string, string] => [source, target]),
  );
}

function linkedGroups(files: Iterable<string>, links: readonly [string, string][]) {
  const parents = new Map<string, string>([...files].map((file) => [file, file]));
  function head(file: string): string {
    const parent = parents.get(file) ?? file;
    if (parent === file) return file;
    const found = head(parent);
    parents.set(file, found);
    return found;
  }
  for (const [from, to] of links) parents.set(head(from), head(to));
  return head;
}

function groupsBySharedFeature(
  folders: ReadonlyMap<string, string>,
  head: (file: string) => string,
) {
  const sharedFeatures = new Map<string, Map<string, string[]>>();
  for (const [file, folder] of [...folders].toSorted(([a], [b]) => a.localeCompare(b))) {
    const groups = sharedFeatures.get(folder) ?? new Map<string, string[]>();
    groups.set(head(file), [...(groups.get(head(file)) ?? []), file.slice(folder.length + 1)]);
    sharedFeatures.set(folder, groups);
  }
  return sharedFeatures;
}

export function sharedFeatureGroupViolations(
  checkedFolder: string,
  modules: readonly ImportedModule[],
  platforms?: readonly string[],
): Violation[] {
  const { root, shown } = checkedPaths(checkedFolder);
  const folders = sharedFeatureFolders(root, modules);
  const links = [...importLinks(modules, folders), ...variantLinks(folders.keys(), platforms)];
  const sharedFeatures = groupsBySharedFeature(folders, linkedGroups(folders.keys(), links));
  return [...sharedFeatures].flatMap(([folder, groups]) => {
    if (groups.size < 2) return [];
    const listed = [...groups.values()].map((files) => `(${files.join(', ')})`).join(' ');
    return [
      {
        rule: 'shared-feature-groups',
        path: shown(folder),
        count: groups.size,
        message: `${shown(folder)} holds ${groups.size} groups of files that never import each other ${listed}: split it into one shared feature per group`,
      },
    ];
  });
}
