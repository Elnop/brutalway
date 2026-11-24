import { join } from 'node:path';
import { packageRoot } from '#src/features/scaffolding/lib/packageRoot.ts';

const PACKAGE_ROOT = packageRoot(import.meta.dirname);

export const TEMPLATES_REPOSITORY = 'Elnop/brutalway';
export const PROJECT_NAME_TOKEN = '__PROJECT_NAME__';
export const PROJECT_ID_TOKEN = '__PROJECT_ID__';
export const OVERLAYS_ROOT = join(PACKAGE_ROOT, 'overlays');
export const LOCAL_ROOT = join(PACKAGE_ROOT, '..', '..', '..');
export const STACK_REFS_URL = new URL('stackRefs.json', import.meta.url);
export const PNPM_VERSION = '12.23.0';
export const CONVERTED_FILES = /(?:\.(?:md|ya?ml|json|[cm]?[jt]sx?)|\/pre-commit)$/u;
export const SKIPPED_FILES = ['package-lock.json', 'CHANGELOG.md'];
export const UNCONVERTED_FOLDERS = ['node_modules', '.git'];
export const NODE_LINKER_BY_STACK: Record<string, string> = { 'react-native': 'hoisted' };
export const NPM_ONLY_FILES = ['package-lock.json', '.npmrc'];
export const PNPM_DENIED_BUILDS: Record<string, boolean> = {
  'core-js': false,
  '@parcel/watcher': false,
};
