import { readdirSync } from 'node:fs';
import type { Dirent } from 'node:fs';
import { basename, join, relative } from 'node:path';
import {
  DEFAULT_CATEGORY_FOLDERS,
  FILE_GROUPS,
} from '#src/features/tree-violations/TreeViolationsConfig.ts';
import type {
  FolderListing,
  TreeOptions,
  TreeScan,
} from '#src/features/tree-violations/TreeViolationsTypes.ts';
import { childLayer } from '#src/features/tree-violations/features/layout/lib/childLayer.ts';
import { filesCheck } from '#src/features/tree-violations/features/layout/lib/filesCheck.ts';
import { localesViolations } from '#src/features/tree-violations/features/layout/lib/localesViolations.ts';
import { kindFolderViolation } from '#src/features/tree-violations/features/layout/lib/kindFolderViolation.ts';
import { sharedRootFileViolations } from '#src/features/tree-violations/features/layout/lib/sharedRootFileViolations.ts';
import type {
  FilesCheck,
  Layer,
} from '#src/features/tree-violations/features/layout/LayoutTypes.ts';
import { platformBase } from '#src/shared/platform-variants/platformBase.ts';
import type { Violation } from '#src/shared/violations/ViolationTypes.ts';

function groupViolations(
  name: string,
  folderName: string,
  listing: FolderListing,
  categoryFolders: ReadonlySet<string>,
): Violation[] {
  const holdsFilesOnly = categoryFolders.has(folderName) && listing.folders.size === 0;
  return FILE_GROUPS.flatMap(({ folder, belongs, appliesIn }) => {
    if (!categoryFolders.has(folder) || !appliesIn(folderName)) return [];
    const loose = listing.files.filter((file) => belongs(listing.baseOf(file)));
    if (loose.length === 0 || (holdsFilesOnly && loose.length === listing.files.length)) return [];
    if (!listing.folders.has(folder) && new Set(loose.map(listing.baseOf)).size === 1) return [];
    return [kindFolderViolation(name, folder, loose, listing.folders.has(folder))];
  });
}

function folderListing(entries: Dirent[], platforms: readonly string[] | undefined): FolderListing {
  return {
    files: entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .toSorted(),
    folders: new Set(entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)),
    baseOf: (fileName) => platformBase(fileName, platforms),
  };
}

function shapeViolations(name: string, count: number, isCategory: boolean): Violation[] {
  if (count === 0) {
    return [{ rule: 'empty-folder', path: name, message: `${name} is empty: delete it` }];
  }
  if (count === 1 && isCategory) {
    return [
      {
        rule: 'single-child',
        path: name,
        message: `${name} holds a single child: move it up one level and delete the folder`,
      },
    ];
  }
  return [];
}

function folderViolations(
  folder: string,
  name: string,
  scan: TreeScan,
  check: FilesCheck,
): Violation[] {
  const children = readdirSync(folder, { withFileTypes: true });
  const listing = folderListing(children, scan.platforms);
  const units =
    new Set(listing.files.map(listing.baseOf)).size + children.length - listing.files.length;
  const violations = shapeViolations(name, units, scan.categories.has(basename(folder)));
  if (check === 'sharedFeatures') {
    return [...violations, ...sharedRootFileViolations(name, listing.files)];
  }
  if (check === 'locales' || check === 'language') {
    return [...violations, ...localesViolations(name, check, listing.files)];
  }
  if (check === 'none') return violations;
  return [...violations, ...groupViolations(name, basename(folder), listing, scan.categories)];
}

export function treeViolations(
  root: string,
  categoryFolders: readonly string[] = DEFAULT_CATEGORY_FOLDERS,
  options: TreeOptions = {},
): Violation[] {
  const scan = { categories: new Set(categoryFolders), platforms: options.platforms };
  function walk(folder: string, layer: Layer): Violation[] {
    const name = relative(join(root, '..'), folder);
    return [
      ...folderViolations(
        folder,
        name,
        scan,
        filesCheck(layer, folder === root && options.rootEntries === true),
      ),
      ...readdirSync(folder, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((entry) => {
          const child = childLayer(layer, `${name}/${entry.name}`, scan.categories);
          return [...child.violations, ...walk(join(folder, entry.name), child.layer)];
        }),
    ];
  }
  return walk(root, 'source');
}
