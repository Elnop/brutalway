import { candidateValues, isChoice, satisfiesRules } from './optionRules.ts';
import type { Answers, StackOption } from './StackTypes.ts';

function crossAll(options: StackOption[]): Answers[] {
  let combinations: Answers[] = [{}];
  for (const option of options) combinations = combinations.flatMap((answers) => candidateValues(option).map((value) => ({ ...answers, [option.id]: value })));
  return combinations;
}

function targetKey(answers: Answers, ids: string[]): string {
  return ids.map((id) => `${id}=${String(answers[id])}`).join(' ');
}

function targetGroups(options: StackOption[]): string[][] {
  const ids = options.map((option) => option.id);
  const pairs = ids.flatMap((id, index) => ids.slice(index + 1).map((other) => [id, other]));
  const choices = options.filter(isChoice).map((option) => option.id);
  return choices.length > 2 ? [...pairs, choices] : pairs;
}

function targetsOf(answers: Answers, groups: string[][]): string[] {
  return groups.map((ids) => targetKey(answers, ids));
}

function defaults(options: StackOption[]): Answers {
  return Object.fromEntries(options.map((option) => [option.id, option.default]));
}

function matchesFixed(answers: Answers, fixed: Answers): boolean {
  return Object.entries(fixed).every(([id, value]) => answers[id] === value);
}

function coveringRows(options: StackOption[], valid: Answers[], fixed: Answers): Answers[] {
  const groups = targetGroups(options);
  const uncovered = new Set(valid.flatMap((answers) => targetsOf(answers, groups)));
  const start = { ...defaults(options), ...fixed };
  const rows = satisfiesRules(options, start) && valid.length > 0 ? [start] : [];
  for (const target of rows.flatMap((answers) => targetsOf(answers, groups))) uncovered.delete(target);
  while (uncovered.size > 0) {
    const gains = valid.map((answers) => targetsOf(answers, groups).filter((target) => uncovered.has(target)).length);
    const best = valid[gains.indexOf(Math.max(...gains))] ?? {};
    rows.push(best);
    for (const target of targetsOf(best, groups)) uncovered.delete(target);
  }
  return rows;
}

export function matrixCombinations(options: StackOption[], everyCombination = false, fixed: Answers = {}): Answers[] {
  const crossed = options.filter((option) => option.independent !== true);
  const independent = options.filter((option) => option.independent === true);
  const valid = crossAll(crossed).filter((answers) => satisfiesRules(options, answers) && matchesFixed(answers, fixed));
  const rows = everyCombination ? valid : coveringRows(crossed, valid, fixed);
  return rows.map((answers, index) => ({
    ...answers,
    ...Object.fromEntries(
      independent.map((option, position) => {
        const values = candidateValues(option);
        return [option.id, values[Math.floor(index / values.length ** position) % values.length] ?? option.default];
      }),
    ),
  }));
}
