import { SLICE, TEST_CODE } from '#src/features/shared-consumers/SharedConsumersConfig.ts';
import { checkedPaths } from '#src/features/shared-consumers/lib/checkedPaths.ts';
import { consumerSlots } from '#src/features/shared-consumers/lib/consumerSlots.ts';
import { sliceOf } from '#src/features/shared-consumers/lib/sliceOf.ts';
import type { ImportedModule } from '#src/features/shared-consumers/SharedConsumersTypes.ts';

function violation(path: string, owner: string, slot: string): string {
  if (slot === owner) {
    return `${path} is only used by ${owner} outside its sub-features: move it out of shared/ into the kind folders of ${owner}`;
  }
  return `${path} is only used by ${slot}: move it into ${slot}`;
}

export function sharedConsumerViolations(
  checkedFolder: string,
  modules: readonly ImportedModule[],
): string[] {
  const { root, shown } = checkedPaths(checkedFolder);
  const slots = consumerSlots(modules);
  return modules.flatMap(({ source }) => {
    const slice = sliceOf(source);
    if (slice === undefined || TEST_CODE.test(source) || !source.startsWith(`${root}/`)) return [];
    const [slot, ...others] = slots(source, slice);
    if (slot === undefined || others.length > 0) return [];
    if (slice.owner === root && !SLICE.test(slot.slice(root.length + 1))) return [];
    return [violation(shown(source), shown(slice.owner), shown(slot))];
  });
}
