import type { AnswerValue, Answers, StackChange } from '#src/shared/stack/StackTypes.ts';

function matches(answer: AnswerValue | undefined, expected: AnswerValue | AnswerValue[]): boolean {
  if (answer === undefined) return false;
  return Array.isArray(expected) ? expected.includes(answer) : answer === expected;
}

export function changeApplies(change: StackChange, answers: Answers): boolean {
  return Object.entries(change.when).every(([id, expected]) => matches(answers[id], expected));
}
