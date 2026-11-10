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

function groupViolations(
  name: string,
  folderName: string,
  listing: FolderListing,
  categoryFolders: ReadonlySet<string>,
): string[] {
  const violations: string[] = [];
  for (const { folder, belongs, appliesIn } of FILE_GROUPS) {
    if (!categoryFolders.has(folder) || !appliesIn(folderName)) continue;
    const loose = listing.files.filter(belongs);
    if (loose.length === 0) continue;
    if (listing.folders.has(folder)) {
      violations.push(`${name} has a ${folder}/ folder: move ${loose.join(', ')} into it`);
    } else if (loose.length > 1) {
      violations.push(
        `${name} holds ${loose.length} ${folder} files (${loose.join(', ')}): move them into ${folder}/`,
      );
    }
  }
  return violations;
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
  function walk(folder: string): string[] {
    return [
      ...folderViolations(
        folder,
        relative(join(root, '..'), folder),
        categories,
        folder !== root || options.rootEntries !== true,
      ),
      ...readdirSync(folder, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((entry) => walk(join(folder, entry.name))),
    ];
  }
  return walk(root);
}
