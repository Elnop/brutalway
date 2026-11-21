import { sharedConsumerViolations } from '#src/features/shared-consumers/lib/sharedConsumerViolations.ts';
import { sharedFeatureGroupViolations } from '#src/features/shared-consumers/lib/sharedFeatureGroupViolations.ts';
import type { ImportedModule } from '#src/features/shared-consumers/SharedConsumersTypes.ts';
import type { Violation } from '#src/shared/violations/ViolationTypes.ts';

export function sharedFeatureViolations(
  checkedFolder: string,
  modules: readonly ImportedModule[],
  platforms?: readonly string[],
): Violation[] {
  return [
    ...sharedConsumerViolations(checkedFolder, modules, platforms),
    ...sharedFeatureGroupViolations(checkedFolder, modules, platforms),
  ];
}
