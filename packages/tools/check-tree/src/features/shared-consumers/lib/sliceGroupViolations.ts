import { TEST_CODE } from '#src/features/shared-consumers/SharedConsumersConfig.ts';
import { checkedPaths } from '#src/features/shared-consumers/lib/checkedPaths.ts';
import { sliceOf } from '#src/features/shared-consumers/lib/sliceOf.ts';
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

function linkedGroups(modules: readonly ImportedModule[], folders: ReadonlyMap<string, string>) {
  const parents = new Map<string, string>([...folders.keys()].map((file) => [file, file]));
  function head(file: string): string {
    const parent = parents.get(file) ?? file;
    if (parent === file) return file;
    const found = head(parent);
    parents.set(file, found);
    return found;
  }
  for (const { source, imports } of modules) {
    const folder = folders.get(source);
    for (const target of imports) {
      if (folder !== undefined && folders.get(target) === folder) {
        parents.set(head(source), head(target));
      }
    }
  }
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
): string[] {
  const { root, shown } = checkedPaths(checkedFolder);
  const folders = sliceFolders(root, modules);
  const slices = groupsBySlice(folders, linkedGroups(modules, folders));
  return [...slices].flatMap(([folder, groups]) => {
    if (groups.size < 2) return [];
    const listed = [...groups.values()].map((files) => `(${files.join(', ')})`).join(' ');
    return [
      `${shown(folder)} holds ${groups.size} groups of files that never import each other ${listed}: split it into one slice per group`,
    ];
  });
}
