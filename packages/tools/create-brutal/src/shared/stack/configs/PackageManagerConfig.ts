import type { StackOption } from '#src/shared/stack/StackTypes.ts';

export const PNPM = 'pnpm';
export const PNPM_ACTION = 'pnpm/action-setup@v6';
export const NPM_SUBCOMMANDS = /\bnpm (run|test|install|publish|create|exec|start|pack)\b/gu;
export const NPM_CI = /\bnpm ci\b/gu;
export const NPX = /\bnpx (?:--no-install )?([@\w][\w@/.-]*)/gu;
export const SETUP_NODE = /^( *)- uses: actions\/setup-node@/gmu;
export const DLX_PACKAGES = ['eas-cli'];

export const PACKAGE_MANAGER_OPTION: StackOption = {
  id: 'package-manager',
  message: 'Which package manager should the project use?',
  default: 'npm',
  values: [
    { id: 'npm', label: 'npm' },
    { id: PNPM, label: 'pnpm' },
  ],
  independent: true,
};
