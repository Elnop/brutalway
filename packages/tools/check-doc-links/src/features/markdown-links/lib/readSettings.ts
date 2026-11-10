import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_SETTINGS } from '#src/features/markdown-links/MarkdownLinksConfig.ts';
import type { DocLinksSettings } from '#src/features/markdown-links/MarkdownLinksTypes.ts';

function fromPackage(cwd: string): Partial<DocLinksSettings> {
  const path = join(cwd, 'package.json');
  if (!existsSync(path)) return {};
  const manifest: unknown = JSON.parse(readFileSync(path, 'utf8'));
  const settings: unknown =
    typeof manifest === 'object' && manifest !== null
      ? Reflect.get(manifest, 'docLinks')
      : undefined;
  return typeof settings === 'object' && settings !== null
    ? Object.fromEntries(Object.entries(settings).filter(([key]) => key in DEFAULT_SETTINGS))
    : {};
}

export function readSettings(cwd: string): DocLinksSettings {
  const settings = fromPackage(cwd);
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    skip: [...DEFAULT_SETTINGS.skip, ...(settings.skip ?? [])],
  };
}
