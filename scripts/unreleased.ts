import type { ReleaseManifest } from './ReleaseTypes.ts';

export function unreleased(
  manifests: readonly ReleaseManifest[],
  tags: ReadonlySet<string>,
): ReleaseManifest[] {
  return manifests.filter(({ folder, name, version, private: isPrivate }) => {
    if (tags.has(`${name}@${version}`)) return false;
    return folder.startsWith('templates/') || !isPrivate;
  });
}
