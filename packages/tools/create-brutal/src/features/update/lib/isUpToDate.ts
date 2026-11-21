import type { BrutalwayState } from '#src/shared/stack/StackTypes.ts';

function sortedOptions(state: BrutalwayState): string {
  return JSON.stringify(
    Object.entries(state.options).toSorted(([left], [right]) => left.localeCompare(right)),
  );
}

export function isUpToDate(from: BrutalwayState, to: BrutalwayState, attach: boolean): boolean {
  return (
    !attach &&
    from.createBrutal === to.createBrutal &&
    from.stack === to.stack &&
    sortedOptions(from) === sortedOptions(to)
  );
}
