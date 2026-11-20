import { basename, dirname } from 'node:path';
import { platformBase } from '#src/shared/platform-variants/platformBase.ts';

export function variantLinks(
  files: Iterable<string>,
  platforms: readonly string[] | undefined,
): [string, string][] {
  const firsts = new Map<string, string>();
  return [...files].flatMap((file): [string, string][] => {
    const unit = `${dirname(file)}/${platformBase(basename(file), platforms)}`;
    const first = firsts.get(unit);
    if (first !== undefined) return [[file, first]];
    firsts.set(unit, file);
    return [];
  });
}
