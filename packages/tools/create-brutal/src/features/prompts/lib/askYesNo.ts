import { confirm, isCancel } from '@clack/prompts';
import { stopCancelled } from '#src/features/prompts/lib/stopCancelled.ts';

export async function askYesNo(
  given: boolean | undefined,
  yes: boolean,
  message: string,
): Promise<boolean> {
  if (given !== undefined) return given;
  if (yes) return true;
  const value = await confirm({ message, initialValue: true });
  return isCancel(value) ? stopCancelled() : value;
}
