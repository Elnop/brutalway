import { releaseManifests } from './releaseManifests.ts';
import type { ReleaseManifest, ReleasePlan } from './ReleaseTypes.ts';
import { unreleased } from './unreleased.ts';

function foldersUnder(manifests: readonly ReleaseManifest[], root: string): string[] {
  return manifests.filter(({ folder }) => folder.startsWith(root)).map(({ folder }) => folder);
}

export function releasePlan(tags: ReadonlySet<string>): ReleasePlan {
  const manifests = releaseManifests();
  const targets = unreleased(manifests, tags);
  const packages = foldersUnder(targets, 'packages/');
  const templates = foldersUnder(targets, 'templates/');
  return {
    names: targets.map(({ name, version }) => `${name}@${version}`),
    build: packages,
    check: [...packages, ...templates],
    publishesPackages: packages.length > 0,
    tagsTemplates: templates.length > 0,
  };
}
