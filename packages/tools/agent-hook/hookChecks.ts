import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import type { HookCheck, HookEdit } from './AgentHookTypes.ts';

const OXLINT_CONFIGS = ['oxlint.config.ts', '.oxlintrc.json'];

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

export function hookChecks(root: string, { file, created }: HookEdit, trees: string[]): HookCheck[] {
  if (file === '' || !inside(root, file)) return [];
  const fromRoot = relative(root, file);
  const checks: HookCheck[] = [];
  if (/\.tsx?$/u.test(file)) {
    const cwd = oxlintFolder(root, file);
    checks.push({ label: `oxlint found problems in ${fromRoot}`, command: 'oxlint', args: ['--type-aware', relative(cwd, file)], cwd });
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
