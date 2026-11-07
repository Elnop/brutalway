import type { AnswerValue, Answers, Blocker, ChoiceOption, OptionRules, StackOption } from './StackTypes.ts';

export function isChoice(option: StackOption): option is ChoiceOption {
  return 'values' in option;
}

export function candidateValues(option: StackOption): AnswerValue[] {
  return isChoice(option) ? option.values.map((value) => value.id) : [true, false];
}

function rulesFor(option: StackOption, value: AnswerValue | undefined): OptionRules {
  if (isChoice(option)) return option.values.find((candidate) => candidate.id === value) ?? {};
  return value === true ? option : {};
}

function brokenRule(rules: OptionRules, answers: Answers): Blocker | undefined {
  for (const [id, value] of Object.entries(rules.requires ?? {})) {
    const answer = answers[id];
    if (answer !== undefined && answer !== value) return { id, value: answer };
  }
  for (const [id, value] of Object.entries(rules.conflicts ?? {})) {
    if (answers[id] === value) return { id, value };
  }
  return undefined;
}

export function blockerOf(option: StackOption, value: AnswerValue, options: StackOption[], answers: Answers): Blocker | undefined {
  const known = Object.fromEntries(Object.entries(answers).filter(([id]) => id !== option.id));
  const ownRule = brokenRule(rulesFor(option, value), known);
  if (ownRule !== undefined) return ownRule;
  for (const other of options) {
    const answer = known[other.id];
    if (other.id === option.id || answer === undefined) continue;
    if (brokenRule(rulesFor(other, answer), { [option.id]: value }) !== undefined) return { id: other.id, value: answer };
  }
  return undefined;
}

export function satisfiesRules(options: StackOption[], answers: Answers): boolean {
  return options.every((option) => brokenRule(rulesFor(option, answers[option.id]), answers) === undefined);
}

export function flag(id: string, value: AnswerValue): string {
  if (typeof value === 'string') return `--${id} ${value}`;
  return value ? `--${id}` : `--no-${id}`;
}
