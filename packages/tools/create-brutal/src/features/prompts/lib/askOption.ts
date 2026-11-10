import { confirm, isCancel, select } from '@clack/prompts';
import { stopCancelled } from '#src/features/prompts/lib/stopCancelled.ts';
import { isChoice } from '#src/shared-features/stack/lib/optionValues.ts';
import type { AnswerValue, StackOption } from '#src/shared-features/stack/StackTypes.ts';

export async function askOption(option: StackOption, allowed: AnswerValue[]): Promise<AnswerValue> {
  if (!isChoice(option)) {
    const value = await confirm({ message: option.message, initialValue: option.default });
    return isCancel(value) ? stopCancelled() : value;
  }
  const values = option.values.filter((value) => allowed.includes(value.id));
  const value = await select({
    message: option.message,
    initialValue: option.default,
    options: values.map((candidate) => ({ value: candidate.id, label: candidate.label })),
  });
  return isCancel(value) ? stopCancelled() : value;
}
