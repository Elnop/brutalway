import type {
  AnswerValue,
  ChoiceOption,
  StackOption,
} from '#src/shared-features/stack/StackTypes.ts';

export function isChoice(option: StackOption): option is ChoiceOption {
  return 'values' in option;
}

export function candidateValues(option: StackOption): AnswerValue[] {
  return isChoice(option) ? option.values.map((value) => value.id) : [true, false];
}
