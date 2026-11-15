import { SLICE_FILE } from '#src/features/shared-consumers/SharedConsumersConfig.ts';
import type { Slice } from '#src/features/shared-consumers/SharedConsumersTypes.ts';

export function sliceOf(path: string): Slice | undefined {
  const [, folder, owner] = SLICE_FILE.exec(path) ?? [];
  if (folder === undefined || owner === undefined) return undefined;
  return { owner, folder };
}
