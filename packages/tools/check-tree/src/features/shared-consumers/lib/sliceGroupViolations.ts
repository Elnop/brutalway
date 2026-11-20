import { TEST_CODE } from '#src/features/shared-consumers/SharedConsumersConfig.ts';
import { checkedPaths } from '#src/features/shared-consumers/lib/checkedPaths.ts';
import { sliceOf } from '#src/features/shared-consumers/lib/sliceOf.ts';
import { variantLinks } from '#src/features/shared-consumers/lib/variantLinks.ts';
import type { ImportedModule } from '#src/features/shared-consumers/SharedConsumersTypes.ts';

function sliceFolders(root: string, modules: readonly ImportedModule[]): Map<string, string> {
  const folders = new Map<string, string>();
  for (const { source } of modules) {
    const slice = sliceOf(source);
    if (slice !== undefined && !TEST_CODE.test(source) && source.startsWith(`${root}/`)) {
      folders.set(source, slice.folder);
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

function groupsBySlice(folders: ReadonlyMap<string, string>, head: (file: string) => string) {
  const slices = new Map<string, Map<string, string[]>>();
  for (const [file, folder] of [...folders].toSorted(([a], [b]) => a.localeCompare(b))) {
    const groups = slices.get(folder) ?? new Map<string, string[]>();
    groups.set(head(file), [...(groups.get(head(file)) ?? []), file.slice(folder.length + 1)]);
    slices.set(folder, groups);
  }
  return slices;
}

export function sliceGroupViolations(
  checkedFolder: string,
  modules: readonly ImportedModule[],
  platforms?: readonly string[],
): string[] {
  const { root, shown } = checkedPaths(checkedFolder);
  const folders = sliceFolders(root, modules);
  const links = [...importLinks(modules, folders), ...variantLinks(folders.keys(), platforms)];
  const slices = groupsBySlice(folders, linkedGroups(folders.keys(), links));
  return [...slices].flatMap(([folder, groups]) => {
    if (groups.size < 2) return [];
    const listed = [...groups.values()].map((files) => `(${files.join(', ')})`).join(' ');
    return [
      `${shown(folder)} holds ${groups.size} groups of files that never import each other ${listed}: split it into one shared feature per group`,
    ];
  });
}
