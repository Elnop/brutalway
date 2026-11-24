import { PACKAGE_MANAGERS } from '#src/features/steps/StepsConfig.ts';
import type { Manifest } from '#src/features/steps/StepsTypes.ts';

function known(name: string | undefined): string | undefined {
  return name !== undefined && PACKAGE_MANAGERS.includes(name) ? name : undefined;
}

export function packageManagerOf(userAgent: string | undefined, manifest: Manifest): string {
  return known(userAgent?.split('/')[0]) ?? known(manifest.packageManager?.split('@')[0]) ?? 'npm';
}
