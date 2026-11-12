import { globSync } from 'node:fs';
import { dirname } from 'node:path';

const PACKAGE_MANIFESTS = 'packages/{configs,plugins,tools,utils}/*/package.json';

export function packageFolders(): string[] {
  return globSync(PACKAGE_MANIFESTS).map(dirname).toSorted();
}
