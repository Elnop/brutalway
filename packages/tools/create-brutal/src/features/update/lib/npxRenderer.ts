import { execFile } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { promisify } from 'node:util';
import type { BrutalwayState } from '#src/shared/stack/StackTypes.ts';

const run = promisify(execFile);

function optionFlags(state: BrutalwayState): string[] {
  return Object.entries(state.options).flatMap(([id, value]) => {
    if (value === true) return [`--${id}`];
    if (value === false) return [`--no-${id}`];
    return [`--${id}`, value];
  });
}

export async function npxRenderer(state: BrutalwayState, dir: string): Promise<void> {
  mkdirSync(dirname(dir), { recursive: true });
  await run(
    'npx',
    [
      '--yes',
      `create-brutal@${state.createBrutal}`,
      dir,
      '--stack',
      state.stack,
      ...optionFlags(state),
      '--no-git',
      '--no-install',
      '--yes',
    ],
    { cwd: dirname(dir), shell: process.platform === 'win32' },
  );
}
