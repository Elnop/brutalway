import { dirname, normalize } from 'node:path';
import type { CheckedPaths } from '#src/features/shared-consumers/SharedConsumersTypes.ts';

export function checkedPaths(checkedFolder: string): CheckedPaths {
  const root = normalize(checkedFolder).replace(/\/$/u, '');
  const parent = dirname(root);
  return {
    root,
    shown: (path) => (parent === '.' ? path : path.slice(parent.length + 1)),
  };
}
