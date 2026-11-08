import { join } from 'node:path';
import { packageRoot } from '#src/shared/lib/packageRoot.ts';

const PACKAGE_ROOT = packageRoot(import.meta.dirname);

export const TEMPLATES_REPOSITORY = 'Elnop/brutalway';
export const PROJECT_NAME_TOKEN = '__PROJECT_NAME__';
export const OVERLAYS_ROOT = join(PACKAGE_ROOT, 'overlays');
export const LOCAL_ROOT = join(PACKAGE_ROOT, '..', '..', '..');
export const STACK_REFS_URL = new URL('stackRefs.json', import.meta.url);
