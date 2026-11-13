import { cruiseImports } from '#src/features/shared-consumers/lib/cruiseImports.ts';
import { sharedConsumerViolations } from '#src/features/shared-consumers/lib/sharedConsumerViolations.ts';

export async function sharedViolations(root: string): Promise<string[]> {
  return sharedConsumerViolations(root, await cruiseImports(root));
}
