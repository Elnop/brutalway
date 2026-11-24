import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import type { StartState, UpdateArgs } from '#src/features/update/UpdateTypes.ts';
import { isRecord } from '#src/shared/is-record/isRecord.ts';
import { readState } from '#src/features/update/lib/readState.ts';
import { STATE_FILE, STATE_SCHEMA_VERSION } from '#src/shared/stack/configs/StateConfig.ts';

function projectName(dir: string): string {
  const manifest: unknown = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  const name = isRecord(manifest) ? manifest['name'] : undefined;
  return typeof name === 'string' ? name : basename(dir);
}

export function startState(dir: string, args: UpdateArgs): StartState {
  const recorded = readState(dir);
  if (recorded !== undefined) return { state: recorded, attach: false };
  if (args.from === undefined || args.stack === undefined) {
    throw new Error(
      `${STATE_FILE} is missing: give the version and the stack the project was made with, --from <version> --stack <id>, and its options with --set <option>=<value>`,
    );
  }
  return {
    state: {
      schemaVersion: STATE_SCHEMA_VERSION,
      createBrutal: args.from,
      stack: args.stack,
      projectName: projectName(dir),
      options: args.set,
    },
    attach: true,
  };
}
