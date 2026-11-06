import { fileURLToPath } from 'node:url';

export const PROJECT_NAME_TOKEN = '__PROJECT_NAME__';
export const OVERLAYS_ROOT = fileURLToPath(new URL('../overlays', import.meta.url));
export const LOCAL_ROOT = fileURLToPath(new URL('../..', import.meta.url));
export const STACK_REFS_URL = new URL('stackRefs.json', import.meta.url);
