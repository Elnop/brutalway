import { SHARED_FEATURE_FILE } from '#src/features/shared-consumers/SharedConsumersConfig.ts';
import type { SharedFeature } from '#src/features/shared-consumers/SharedConsumersTypes.ts';

export function sharedFeatureOf(path: string): SharedFeature | undefined {
  const [, folder, owner] = SHARED_FEATURE_FILE.exec(path) ?? [];
  if (folder === undefined || owner === undefined) return undefined;
  return { owner, folder };
}
