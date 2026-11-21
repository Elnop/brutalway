import { parseArgs } from 'node:util';
import type { UpdateArgs } from '#src/features/update/UpdateTypes.ts';
import type { AnswerValue } from '#src/shared/stack/StackTypes.ts';

function answerOf(pair: string): [string, AnswerValue] {
  const [id = '', value = ''] = pair.split('=');
  if (value === 'true') return [id, true];
  if (value === 'false') return [id, false];
  return [id, value];
}

export function readUpdateArgs(argv: string[]): UpdateArgs {
  const { values } = parseArgs({
    args: argv,
    options: {
      to: { type: 'string' },
      from: { type: 'string' },
      stack: { type: 'string' },
      set: { type: 'string', multiple: true },
      local: { type: 'boolean' },
    },
  });
  return {
    to: values.to,
    from: values.from,
    stack: values.stack,
    set: Object.fromEntries((values.set ?? []).map(answerOf)),
    local: values.local === true,
  };
}
