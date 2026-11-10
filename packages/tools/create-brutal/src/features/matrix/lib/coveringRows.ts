import { targetGroups, targetsOf } from '#src/features/matrix/lib/pairTargets.ts';
import { satisfiesRules } from '#src/shared-features/stack/lib/optionRules.ts';
import type { Answers, StackOption } from '#src/shared-features/stack/StackTypes.ts';

function defaults(options: StackOption[]): Answers {
  return Object.fromEntries(options.map((option) => [option.id, option.default]));
}

function removeCovered(uncovered: Set<string>, rows: Answers[], groups: string[][]): void {
  for (const target of rows.flatMap((answers) => targetsOf(answers, groups))) {
    uncovered.delete(target);
  }
}

function bestRow(valid: Answers[], groups: string[][], uncovered: Set<string>): Answers {
  const gains = valid.map(
    (answers) => targetsOf(answers, groups).filter((target) => uncovered.has(target)).length,
  );
  return valid[gains.indexOf(Math.max(...gains))] ?? {};
}

export function coveringRows(options: StackOption[], valid: Answers[], fixed: Answers): Answers[] {
  const groups = targetGroups(options);
  const uncovered = new Set(valid.flatMap((answers) => targetsOf(answers, groups)));
  const start = { ...defaults(options), ...fixed };
  const rows = satisfiesRules(options, start) && valid.length > 0 ? [start] : [];
  removeCovered(uncovered, rows, groups);
  while (uncovered.size > 0) {
    const best = bestRow(valid, groups, uncovered);
    rows.push(best);
    removeCovered(uncovered, [best], groups);
  }
  return rows;
}
