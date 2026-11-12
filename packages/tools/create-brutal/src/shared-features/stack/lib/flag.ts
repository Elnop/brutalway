import type { AnswerValue } from '#src/shared-features/stack/StackTypes.ts';

export function flag(id: string, value: AnswerValue): string {
  if (typeof value === 'string') return `--${id} ${value}`;
  return value ? `--${id}` : `--no-${id}`;
}
