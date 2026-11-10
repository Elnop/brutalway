import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { HookCheck, HookScope } from '#src/features/edit-checks/EditChecksTypes.ts';
import { insideProject } from '#src/features/edit-checks/lib/insideProject.ts';
import { oxlintCheck } from '#src/features/edit-checks/lib/oxlintCheck.ts';
import type { HookEdit } from '#src/shared-features/hook-edit/HookEditTypes.ts';
import { vendoredFolder } from '#src/shared-features/vendored/vendoredFolder.ts';

const STYLELINT_CONFIGS = [
  '.stylelintrc',
  '.stylelintrc.json',
  '.stylelintrc.yml',
  '.stylelintrc.yaml',
  '.stylelintrc.js',
  '.stylelintrc.mjs',
  'stylelint.config.js',
  'stylelint.config.mjs',
  'stylelint.config.cjs',
];

function hasStylelintConfig(root: string) {
  if (STYLELINT_CONFIGS.some((config) => existsSync(join(root, config)))) return true;
  const manifest = join(root, 'package.json');
  return existsSync(manifest) && /"stylelint"\s*:\s*\{/u.test(readFileSync(manifest, 'utf8'));
}

function isVendored(root: string, file: string, vendored: string[]) {
  return vendoredFolder(relative(root, file), vendored) !== undefined;
}

export function hookChecks(root: string, { file, created }: Pick<HookEdit, 'file' | 'created'>, { trees, vendored = [], rootEntries = false }: HookScope): HookCheck[] {
  if (file === '' || !insideProject(root, file) || isVendored(root, file, vendored)) return [];
  const fromRoot = relative(root, file);
  const checks: HookCheck[] = [];
  if (/\.tsx?$/u.test(file)) checks.push(oxlintCheck(root, file));
  if (file.endsWith('.css') && hasStylelintConfig(root)) {
    checks.push({ label: `stylelint found problems in ${fromRoot}`, command: 'stylelint', args: [fromRoot], cwd: root });
  }
  if ((created || file.endsWith('.md')) && existsSync(join(root, '.alint.yml'))) {
    checks.push({ label: 'alint found problems in the repository layout or the docs', command: 'alint', args: ['check'], cwd: root });
  }
  if (created) {
    for (const tree of trees.filter((folder) => fromRoot.startsWith(`${folder}/`))) {
      checks.push({ label: `check-tree found problems in ${tree}`, command: 'check-tree', args: rootEntries ? [tree, '--root-entries'] : [tree], cwd: root });
    }
  }
  return checks;
}
