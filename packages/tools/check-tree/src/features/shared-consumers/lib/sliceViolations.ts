import { sharedConsumerViolations } from '#src/features/shared-consumers/lib/sharedConsumerViolations.ts';
import { sliceGroupViolations } from '#src/features/shared-consumers/lib/sliceGroupViolations.ts';
import type { ImportedModule } from '#src/features/shared-consumers/SharedConsumersTypes.ts';

export function sliceViolations(
  checkedFolder: string,
  modules: readonly ImportedModule[],
  platforms?: readonly string[],
): string[] {
  return [
    ...sharedConsumerViolations(checkedFolder, modules),
    ...sliceGroupViolations(checkedFolder, modules, platforms),
  ];
}
