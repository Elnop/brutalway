import { blockerOf, candidateValues, flag, isChoice } from './optionRules.ts';
import type { AnswerValue, Answers, StackOption } from './StackTypes.ts';

type AskOption = (option: StackOption, allowed: AnswerValue[]) => Promise<AnswerValue>;

function checkGiven(option: StackOption, value: AnswerValue): void {
  if (candidateValues(option).includes(value)) return;
  if (isChoice(option)) throw new Error(`${option.id} has no value ${String(value)}. Choose one of: ${option.values.map((candidate) => candidate.id).join(', ')}`);
  throw new Error(`${option.id} takes true or false, not ${JSON.stringify(value)}`);
}

export async function resolveAnswers(options: StackOption[], given: Answers, ask: AskOption | undefined): Promise<Answers> {
  for (const option of options) {
    const value = given[option.id];
    if (value !== undefined) checkGiven(option, value);
  }
  const answers: Answers = {};
  for (const option of options) {
    const known = { ...given, ...answers };
    const chosen = given[option.id];
    if (chosen !== undefined) {
      const blocker = blockerOf(option, chosen, options, known);
      if (blocker !== undefined) throw new Error(`${flag(option.id, chosen)} cannot be used with ${flag(blocker.id, blocker.value)}`);
      answers[option.id] = chosen;
      continue;
    }
    const allowed = candidateValues(option).filter((value) => blockerOf(option, value, options, known) === undefined);
    const [first] = allowed;
    if (first === undefined) throw new Error(`No value of ${option.id} works with the other options`);
    if (allowed.length === 1) answers[option.id] = first;
    else if (ask === undefined) answers[option.id] = allowed.includes(option.default) ? option.default : first;
    else answers[option.id] = await ask(option, allowed);
  }
  return answers;
}
