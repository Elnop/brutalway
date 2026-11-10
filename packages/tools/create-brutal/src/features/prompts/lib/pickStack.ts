import { isCancel, select } from '@clack/prompts';
import { stopCancelled } from '#src/features/prompts/lib/stopCancelled.ts';
import type { Stack } from '#src/shared-features/stack/StackTypes.ts';

export async function pickStack(
  stacks: Stack[],
  id: string | undefined,
  yes: boolean,
): Promise<Stack> {
  if (id !== undefined) {
    const found = stacks.find((stack) => stack.id === id);
    if (found === undefined) {
      throw new Error(
        `Unknown stack ${id}. Choose one of: ${stacks.map((stack) => stack.id).join(', ')}`,
      );
    }
    return found;
  }
  if (yes) throw new Error('--yes needs --stack');
  const value = await select({
    message: 'Stack',
    options: stacks.map((stack) => ({ value: stack, label: stack.label })),
  });
  return isCancel(value) ? stopCancelled() : value;
}
