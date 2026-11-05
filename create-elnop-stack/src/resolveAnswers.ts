import type { Answers, StackOption } from './StackTypes.ts';

type AskOption = (option: StackOption) => Promise<boolean>;

function forcedValue(option: StackOption, options: StackOption[], answers: Answers): { value: boolean; by: string } | undefined {
  for (const other of options) {
    const required = other.requires?.[option.id];
    if (answers[other.id] && required !== undefined) return { value: required, by: other.id };
  }
  return undefined;
}

function flag(id: string, value: boolean): string {
  return value ? `--${id}` : `--no-${id}`;
}

export async function resolveAnswers(options: StackOption[], given: Answers, ask: AskOption | undefined): Promise<Answers> {
  const answers: Answers = {};
  for (const option of options) {
    const forced = forcedValue(option, options, answers);
    const chosen = given[option.id];
    if (forced !== undefined && chosen !== undefined && chosen !== forced.value) {
      throw new Error(`${flag(option.id, chosen)} cannot be used with ${flag(forced.by, true)}`);
    }
    if (forced !== undefined) answers[option.id] = forced.value;
    else if (chosen !== undefined) answers[option.id] = chosen;
    else answers[option.id] = ask === undefined ? option.default : await ask(option);
  }
  return answers;
}
