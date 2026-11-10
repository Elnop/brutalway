import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { HookCheck, HookScope } from '#src/features/edit-checks/EditChecksTypes.ts';
import { insideProject } from '#src/features/edit-checks/lib/insideProject.ts';
import { oxlintCheck } from '#src/features/edit-checks/lib/oxlintCheck.ts';
import { stylelintCheck } from '#src/features/edit-checks/lib/stylelintCheck.ts';
import type { HookEdit } from '#src/shared-features/hook-edit/HookEditTypes.ts';
import { vendoredFolder } from '#src/shared-features/vendored/vendoredFolder.ts';

function isVendored(root: string, file: string, vendored: string[]) {
  return vendoredFolder(relative(root, file), vendored) !== undefined;
}

function alintCheck(root: string, file: string, created: boolean): HookCheck[] {
  if (!(created || file.endsWith('.md')) || !existsSync(join(root, '.alint.yml'))) return [];
  return [
    {
      label: 'alint found problems in the repository layout or the docs',
      command: 'alint',
      args: ['check'],
      cwd: root,
    },
  ];
}

function treeChecks(
  root: string,
  fromRoot: string,
  { trees, rootEntries = false }: HookScope,
): HookCheck[] {
  return trees
    .filter((folder) => fromRoot.startsWith(`${folder}/`))
    .map((tree) => ({
      label: `check-tree found problems in ${tree}`,
      command: 'check-tree',
      args: rootEntries ? [tree, '--root-entries'] : [tree],
      cwd: root,
    }));
}

export function hookChecks(
  root: string,
  { file, created }: Pick<HookEdit, 'file' | 'created'>,
  scope: HookScope,
): HookCheck[] {
  if (file === '' || !insideProject(root, file) || isVendored(root, file, scope.vendored ?? [])) {
    return [];
  }
  const fromRoot = relative(root, file);
  return [
    ...(/\.tsx?$/u.test(file) ? [oxlintCheck(root, file)] : []),
    ...stylelintCheck(root, fromRoot),
    ...alintCheck(root, file, created),
    ...(created ? treeChecks(root, fromRoot, scope) : []),
  ];
}
