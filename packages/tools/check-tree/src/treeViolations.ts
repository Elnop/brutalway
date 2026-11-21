import type { TreeOptions } from '#src/features/tree-violations/TreeViolationsTypes.ts';
import { treeViolations as violations } from '#src/features/tree-violations/treeViolations.ts';

export function treeViolations(
  root: string,
  categoryFolders?: readonly string[],
  options?: TreeOptions,
): string[] {
  return violations(root, categoryFolders, options).map(({ message }) => message);
}
