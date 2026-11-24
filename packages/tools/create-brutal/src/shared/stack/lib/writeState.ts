import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { STATE_FILE } from '#src/shared/stack/configs/StateConfig.ts';
import type { BrutalwayState } from '#src/shared/stack/StackTypes.ts';

export function writeState(dir: string, state: BrutalwayState): void {
  writeFileSync(join(dir, STATE_FILE), `${JSON.stringify(state, null, 2)}\n`);
}
