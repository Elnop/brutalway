import { SUB_FEATURE_OR_SHARED_FEATURE } from '#src/features/shared-consumers/SharedConsumersConfig.ts';
import { checkedPaths } from '#src/features/shared-consumers/lib/checkedPaths.ts';
import { consumerSlots } from '#src/features/shared-consumers/lib/consumerSlots.ts';
import { sharedFeatureOf } from '#src/features/shared-consumers/lib/sharedFeatureOf.ts';
import type { ImportedModule } from '#src/features/shared-consumers/SharedConsumersTypes.ts';
import type { Violation } from '#src/shared/violations/ViolationTypes.ts';

function violation(path: string, owner: string, slot: string): Violation {
  const message =
    slot === owner
      ? `${path} is only used by ${owner} outside its sub-features: move it out of shared/ into the kind folders of ${owner}, its test following it under test/unit`
      : `${path} is only used by ${slot}: move it into ${slot}, its test following it under test/unit`;
  return { rule: 'single-consumer', path, message };
}

export function sharedConsumerViolations(
  checkedFolder: string,
  modules: readonly ImportedModule[],
  platforms?: readonly string[],
): Violation[] {
  const { root, shown } = checkedPaths(checkedFolder);
  const slots = consumerSlots(modules, platforms);
  return modules.flatMap(({ source }) => {
    const sharedFeature = sharedFeatureOf(source);
    if (sharedFeature === undefined || !source.startsWith(`${root}/`)) {
      return [];
    }
    const [slot, ...others] = slots(source, sharedFeature);
    if (slot === undefined || others.length > 0) return [];
    if (
      sharedFeature.owner === root &&
      !SUB_FEATURE_OR_SHARED_FEATURE.test(slot.slice(root.length + 1))
    ) {
      return [];
    }
    return [violation(shown(source), shown(sharedFeature.owner), shown(slot))];
  });
}
