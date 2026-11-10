import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import type { HookCheck } from '#src/features/edit-checks/EditChecksTypes.ts';
import { insideProject } from '#src/features/edit-checks/lib/insideProject.ts';

const OXLINT_CONFIGS = ['oxlint.config.ts', '.oxlintrc.json'];

function oxlintFolder(root: string, file: string) {
  for (let folder = dirname(file); insideProject(root, folder); folder = dirname(folder)) {
    if (OXLINT_CONFIGS.some((config) => existsSync(join(folder, config)))) return folder;
    if (folder === root) break;
  }
  return root;
}

export function oxlintCheck(root: string, file: string): HookCheck {
  const cwd = oxlintFolder(root, file);
  return { label: `oxlint found problems in ${relative(root, file)}`, command: 'oxlint', args: ['--type-aware', relative(cwd, file)], cwd };
}
