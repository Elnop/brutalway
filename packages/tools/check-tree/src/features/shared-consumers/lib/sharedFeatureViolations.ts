import { sharedConsumerViolations } from '#src/features/shared-consumers/lib/sharedConsumerViolations.ts';
import { sharedFeatureGroupViolations } from '#src/features/shared-consumers/lib/sharedFeatureGroupViolations.ts';
import type { ImportedModule } from '#src/features/shared-consumers/SharedConsumersTypes.ts';

export function sharedFeatureViolations(
  checkedFolder: string,
  modules: readonly ImportedModule[],
  platforms?: readonly string[],
): string[] {
  return [
    ...sharedConsumerViolations(checkedFolder, modules, platforms),
    ...sharedFeatureGroupViolations(checkedFolder, modules, platforms),
  ];
}
