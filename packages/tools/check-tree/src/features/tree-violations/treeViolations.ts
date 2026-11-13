import { readdirSync } from 'node:fs';
import type { Dirent } from 'node:fs';
import { basename, join, relative } from 'node:path';
import {
  DEFAULT_CATEGORY_FOLDERS,
  FILE_GROUPS,
  TEST_FILE,
} from '#src/features/tree-violations/TreeViolationsConfig.ts';
import type {
  FolderListing,
  TreeOptions,
} from '#src/features/tree-violations/TreeViolationsTypes.ts';
import { childLayer } from '#src/features/tree-violations/features/layout/childLayer.ts';
import type { Layer } from '#src/features/tree-violations/features/layout/LayoutTypes.ts';

function groupViolations(
  name: string,
  folderName: string,
  listing: FolderListing,
  categoryFolders: ReadonlySet<string>,
): string[] {
  const holdsFilesOnly = categoryFolders.has(folderName) && listing.folders.size === 0;
  return FILE_GROUPS.flatMap(({ folder, belongs, appliesIn }) => {
    if (!categoryFolders.has(folder) || !appliesIn(folderName)) return [];
    const loose = listing.files.filter(belongs);
    if (loose.length === 0 || (holdsFilesOnly && loose.length === listing.files.length)) return [];
    if (listing.folders.has(folder)) {
      return [`${name} has a ${folder}/ folder: move ${loose.join(', ')} into it`];
    }
    if (loose.length === 1) return [];
    return [
      `${name} holds ${loose.length} ${folder} files (${loose.join(', ')}): move them into ${folder}/`,
    ];
  });
}

function folderListing(entries: Dirent[]): FolderListing {
  return {
    files: entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .toSorted(),
    folders: new Set(entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)),
  };
}

function shapeViolations(name: string, count: number, isCategory: boolean): string[] {
  if (count === 0) return [`${name} is empty: delete it`];
  if (count === 1 && isCategory) {
    return [`${name} holds a single child: move it up one level and delete the folder`];
  }
  return [];
}

function folderViolations(
  folder: string,
  name: string,
  categoryFolders: ReadonlySet<string>,
  groupsFiles: boolean,
): string[] {
  const children = readdirSync(folder, { withFileTypes: true }).filter(
    (entry) => !TEST_FILE.test(entry.name),
  );
  const violations = shapeViolations(name, children.length, categoryFolders.has(basename(folder)));
  if (!groupsFiles) return violations;
  const listing = folderListing(children);
  return [...violations, ...groupViolations(name, basename(folder), listing, categoryFolders)];
}

export function treeViolations(
  root: string,
  categoryFolders: readonly string[] = DEFAULT_CATEGORY_FOLDERS,
  options: TreeOptions = {},
): string[] {
  const categories = new Set(categoryFolders);
  function walk(folder: string, layer: Layer): string[] {
    const name = relative(join(root, '..'), folder);
    return [
      ...folderViolations(
        folder,
        name,
        categories,
        folder !== root || options.rootEntries !== true,
      ),
      ...readdirSync(folder, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((entry) => {
          const child = childLayer(layer, `${name}/${entry.name}`, categories);
          return [...child.violations, ...walk(join(folder, entry.name), child.layer)];
        }),
    ];
  }
  return walk(root, 'source');
}
