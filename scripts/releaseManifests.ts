import { globSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import type { ReleaseManifest } from './ReleaseTypes.ts';

const MANIFESTS = [
  'packages/{configs,plugins,tools,utils}/*/package.json',
  'templates/*/package.json',
];

export function releaseManifests(): ReleaseManifest[] {
  return globSync(MANIFESTS)
    .toSorted()
    .map((manifestPath) => {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      return {
        folder: dirname(manifestPath),
        name: String(manifest.name),
        version: String(manifest.version),
        private: manifest.private === true,
      };
    });
}
