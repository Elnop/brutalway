import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import type { HookCheck } from '#src/features/edit-checks/EditChecksTypes.ts';
import type { HookEdit } from '#src/shared-features/hook-edit/HookEditTypes.ts';
import { vendoredFolder } from '#src/shared-features/vendored/vendoredFolder.ts';

const OXLINT_CONFIGS = ['oxlint.config.ts', '.oxlintrc.json'];
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

function inside(root: string, path: string) {
  const fromRoot = relative(root, path);
  return !fromRoot.startsWith('..') && !fromRoot.split('/').includes('node_modules');
}

function oxlintFolder(root: string, file: string) {
  for (let folder = dirname(file); inside(root, folder); folder = dirname(folder)) {
    if (OXLINT_CONFIGS.some((config) => existsSync(join(folder, config)))) return folder;
    if (folder === root) break;
  }
  return root;
}

export function hookChecks(root: string, { file, created }: Pick<HookEdit, 'file' | 'created'>, trees: string[], vendored: string[] = []): HookCheck[] {
  if (file === '' || !inside(root, file) || isVendored(root, file, vendored)) return [];
  const fromRoot = relative(root, file);
  const checks: HookCheck[] = [];
  if (/\.tsx?$/u.test(file)) {
    const cwd = oxlintFolder(root, file);
    checks.push({ label: `oxlint found problems in ${fromRoot}`, command: 'oxlint', args: ['--type-aware', relative(cwd, file)], cwd });
  }
  if (file.endsWith('.css') && hasStylelintConfig(root)) {
    checks.push({ label: `stylelint found problems in ${fromRoot}`, command: 'stylelint', args: [fromRoot], cwd: root });
  }
  if ((created || file.endsWith('.md')) && existsSync(join(root, '.alint.yml'))) {
    checks.push({ label: 'alint found problems in the repository layout or the docs', command: 'alint', args: ['check'], cwd: root });
  }
  if (created) {
    for (const tree of trees.filter((folder) => fromRoot.startsWith(`${folder}/`))) {
      checks.push({ label: `check-tree found problems in ${tree}`, command: 'check-tree', args: [tree], cwd: root });
    }
  }
  return checks;
}
