import { isChoice } from '#src/shared-features/stack/lib/optionValues.ts';
import type { Answers, StackOption } from '#src/shared-features/stack/StackTypes.ts';

function targetKey(answers: Answers, ids: string[]): string {
  return ids.map((id) => `${id}=${String(answers[id])}`).join(' ');
}

export function targetGroups(options: StackOption[]): string[][] {
  const ids = options.map((option) => option.id);
  const pairs = ids.flatMap((id, index) => ids.slice(index + 1).map((other) => [id, other]));
  const choices = options.filter(isChoice).map((option) => option.id);
  return choices.length > 2 ? [...pairs, choices] : pairs;
}

export function targetsOf(answers: Answers, groups: string[][]): string[] {
  return groups.map((ids) => targetKey(answers, ids));
}
