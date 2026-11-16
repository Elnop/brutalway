import type { Answers } from '#src/shared/stack/StackTypes.ts';

export function matrixLabel(answers: Answers): string {
  return Object.entries(answers)
    .map(([id, value]) => {
      if (typeof value === 'string') return `${id}=${value}`;
      return value ? id : `no-${id}`;
    })
    .join(' ');
}
