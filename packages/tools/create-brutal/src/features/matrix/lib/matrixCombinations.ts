import { coveringRows } from '#src/features/matrix/lib/coveringRows.ts';
import { satisfiesRules } from '#src/shared/stack/lib/optionRules.ts';
import { candidateValues } from '#src/shared/stack/lib/optionValues.ts';
import type { Answers, StackOption } from '#src/shared/stack/StackTypes.ts';

function crossAll(options: StackOption[]): Answers[] {
  let combinations: Answers[] = [{}];
  for (const option of options) {
    combinations = combinations.flatMap((answers) =>
      candidateValues(option).map((value) => ({ ...answers, [option.id]: value })),
    );
  }
  return combinations;
}

function matchesFixed(answers: Answers, fixed: Answers): boolean {
  return Object.entries(fixed).every(([id, value]) => !(id in answers) || answers[id] === value);
}

function cycledValue(option: StackOption, row: number, position: number, fixed: Answers) {
  const given = fixed[option.id];
  if (given !== undefined) return given;
  const values = candidateValues(option);
  return values[Math.floor(row / values.length ** position) % values.length] ?? option.default;
}

export function matrixCombinations(
  options: StackOption[],
  everyCombination = false,
  fixed: Answers = {},
): Answers[] {
  const crossed = options.filter((option) => option.independent !== true);
  const independent = options.filter((option) => option.independent === true);
  const valid = crossAll(crossed).filter(
    (answers) => satisfiesRules(options, answers) && matchesFixed(answers, fixed),
  );
  const rows = everyCombination ? valid : coveringRows(crossed, valid, fixed);
  return rows.map((answers, index) => ({
    ...answers,
    ...Object.fromEntries(
      independent.map((option, position) => [
        option.id,
        cycledValue(option, index, position, fixed),
      ]),
    ),
  }));
}
