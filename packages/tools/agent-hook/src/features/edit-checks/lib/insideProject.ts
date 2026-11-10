import { relative } from 'node:path';

export function insideProject(root: string, path: string) {
  const fromRoot = relative(root, path);
  return !fromRoot.startsWith('..') && !fromRoot.split('/').includes('node_modules');
}
