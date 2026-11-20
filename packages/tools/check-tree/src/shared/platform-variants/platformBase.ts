import { DEFAULT_PLATFORMS } from '#src/shared/platform-variants/PlatformVariantsConfig.ts';

export function platformBase(
  fileName: string,
  platforms: readonly string[] = DEFAULT_PLATFORMS,
): string {
  const parts = fileName.split('.');
  const platform = parts.at(-2);
  if (parts.length < 3 || platform === undefined || !platforms.includes(platform)) return fileName;
  return [...parts.slice(0, -2), parts.at(-1)].join('.');
}
