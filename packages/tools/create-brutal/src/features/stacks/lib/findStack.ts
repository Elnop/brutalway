import { stacks } from '#src/features/stacks/configs/stacksConfig.ts';
import type { Stack } from '#src/shared/stack/StackTypes.ts';

export function findStack(id: string): Stack {
  const stack = stacks.find((candidate) => candidate.id === id);
  if (stack !== undefined) return stack;
  throw new Error(`no stack ${id}: ${stacks.map((known) => known.id).join(', ')}`);
}
