import { cruiseImports } from '#src/features/shared-consumers/lib/cruiseImports.ts';
import { sharedFeatureViolations } from '#src/features/shared-consumers/lib/sharedFeatureViolations.ts';

export async function sharedViolations(
  root: string,
  platforms?: readonly string[],
): Promise<string[]> {
  return sharedFeatureViolations(root, await cruiseImports(root), platforms).map(
    ({ message }) => message,
  );
}
