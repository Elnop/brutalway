import { SLICE, TEST_CODE } from '#src/features/shared-consumers/SharedConsumersConfig.ts';
import { consumerSlots } from '#src/features/shared-consumers/lib/consumerSlots.ts';
import type { ImportedModule } from '#src/features/shared-consumers/SharedConsumersTypes.ts';

function ownerOf(path: string): string | undefined {
  const index = path.lastIndexOf('/shared/');
  return index === -1 ? undefined : path.slice(0, index);
}

function violation(path: string, owner: string, slot: string): string {
  if (slot === owner) {
    return `${path} is only used by ${owner} outside its sub-features: move it out of shared/ into the kind folders of ${owner}`;
  }
  return `${path} is only used by ${slot}: move it into ${slot}`;
}

export function sharedConsumerViolations(
  root: string,
  modules: readonly ImportedModule[],
): string[] {
  const slots = consumerSlots(modules);
  return modules.flatMap(({ source }) => {
    const owner = ownerOf(source);
    if (owner === undefined || TEST_CODE.test(source) || !source.startsWith(`${root}/`)) return [];
    const [slot, ...others] = slots(source, owner);
    if (slot === undefined || others.length > 0) return [];
    if (owner === root && !SLICE.test(slot.slice(root.length + 1))) return [];
    return [violation(source, owner, slot)];
  });
}
