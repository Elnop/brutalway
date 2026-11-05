import type { Answers, StackOption } from './StackTypes.ts';

function satisfiesRequirements(options: StackOption[], answers: Answers): boolean {
  return options.every((option) => !answers[option.id] || Object.entries(option.requires ?? {}).every(([id, value]) => answers[id] === value));
}

export function matrixCombinations(options: StackOption[]): Answers[] {
  const crossed = options.filter((option) => option.independent !== true);
  const independent = options.filter((option) => option.independent === true);
  let combinations: Answers[] = [{}];
  for (const option of crossed) combinations = combinations.flatMap((answers) => [true, false].map((value) => ({ ...answers, [option.id]: value })));
  return combinations
    .filter((answers) => satisfiesRequirements(options, answers))
    .map((answers, index) => ({ ...answers, ...Object.fromEntries(independent.map((option, position) => [option.id, Math.floor(index / 2 ** position) % 2 === 0])) }));
}
