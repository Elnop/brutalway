import type { Answers } from '#src/shared-features/stack/StackTypes.ts';

export function onlyAnswers(only: string | undefined): Answers {
  if (only === undefined) return {};
  return Object.fromEntries(
    only.split(',').map((pair) => {
      const [id = '', value = ''] = pair.split('=');
      if (value === 'true' || value === 'false') return [id, value === 'true'];
      return [id, value];
    }),
  );
}
