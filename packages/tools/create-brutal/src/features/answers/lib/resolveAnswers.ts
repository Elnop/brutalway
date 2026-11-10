import { blockerOf, candidateValues, flag, isChoice } from '#src/shared-features/stack/optionRules.ts';
import type { AnswerValue, Answers, StackOption } from '#src/shared-features/stack/StackTypes.ts';

type AskOption = (option: StackOption, allowed: AnswerValue[]) => Promise<AnswerValue>;

function checkGiven(option: StackOption, value: AnswerValue): void {
  if (candidateValues(option).includes(value)) return;
  if (isChoice(option)) throw new Error(`${option.id} has no value ${String(value)}. Choose one of: ${option.values.map((candidate) => candidate.id).join(', ')}`);
  throw new Error(`${option.id} takes true or false, not ${JSON.stringify(value)}`);
}

function givenAnswer(option: StackOption, chosen: AnswerValue, options: StackOption[], known: Answers): AnswerValue {
  const blocker = blockerOf(option, chosen, options, known);
  if (blocker !== undefined) throw new Error(`${flag(option.id, chosen)} cannot be used with ${flag(blocker.id, blocker.value)}`);
  return chosen;
}

async function pickedAnswer(option: StackOption, options: StackOption[], known: Answers, ask: AskOption | undefined): Promise<AnswerValue> {
  const allowed = candidateValues(option).filter((value) => blockerOf(option, value, options, known) === undefined);
  const [first] = allowed;
  if (first === undefined) throw new Error(`No value of ${option.id} works with the other options`);
  if (allowed.length === 1) return first;
  if (ask === undefined) return allowed.includes(option.default) ? option.default : first;
  return ask(option, allowed);
}

function checkAllGiven(options: StackOption[], given: Answers): void {
  for (const option of options) {
    const value = given[option.id];
    if (value !== undefined) checkGiven(option, value);
  }
}

export async function resolveAnswers(options: StackOption[], given: Answers, ask: AskOption | undefined): Promise<Answers> {
  checkAllGiven(options, given);
  const answers: Answers = {};
  for (const option of options) {
    const known = { ...given, ...answers };
    const chosen = given[option.id];
    answers[option.id] = chosen === undefined ? await pickedAnswer(option, options, known, ask) : givenAnswer(option, chosen, options, known);
  }
  return answers;
}
