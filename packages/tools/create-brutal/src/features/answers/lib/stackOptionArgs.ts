import type { ParseArgsOptionsConfig } from 'node:util';
import { isChoice } from '#src/shared-features/stack/lib/optionValues.ts';
import type { Answers, Stack } from '#src/shared-features/stack/StackTypes.ts';

export function stackOptionsConfig(stack: Stack | undefined): ParseArgsOptionsConfig {
  return Object.fromEntries(
    (stack?.options ?? []).map((option) => [
      option.id,
      { type: isChoice(option) ? 'string' : 'boolean' },
    ]),
  );
}

export function stackAnswers(
  values: Record<string, unknown>,
  stack: Stack | undefined,
  presetOptions: Answers,
): Answers {
  const options: Answers = { ...presetOptions };
  for (const option of stack?.options ?? []) {
    const value = values[option.id];
    if (typeof value === 'boolean' || typeof value === 'string') options[option.id] = value;
  }
  return options;
}
