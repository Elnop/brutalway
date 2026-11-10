import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { HookCheck } from '#src/features/edit-checks/EditChecksTypes.ts';

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

export function stylelintCheck(root: string, fromRoot: string): HookCheck[] {
  if (!fromRoot.endsWith('.css') || !hasStylelintConfig(root)) return [];
  return [
    {
      label: `stylelint found problems in ${fromRoot}`,
      command: 'stylelint',
      args: [fromRoot],
      cwd: root,
    },
  ];
}
