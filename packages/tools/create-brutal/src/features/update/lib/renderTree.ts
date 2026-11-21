import { join } from 'node:path';
import type { Renderer } from '#src/features/update/UpdateTypes.ts';
import type { BrutalwayState } from '#src/shared/stack/StackTypes.ts';

export async function renderTree(
  render: Renderer,
  state: BrutalwayState,
  root: string,
): Promise<string> {
  const dir = join(root, state.projectName);
  await render(state, dir);
  return dir;
}
