import { cruiseImports } from '#src/features/shared-consumers/lib/cruiseImports.ts';
import { sliceViolations } from '#src/features/shared-consumers/lib/sliceViolations.ts';

export async function sharedViolations(
  root: string,
  platforms?: readonly string[],
): Promise<string[]> {
  return sliceViolations(root, await cruiseImports(root), platforms);
}
