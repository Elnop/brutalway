import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_SETTINGS } from './DocLinksConfig.ts';
import type { DocLinksSettings } from './DocLinksTypes.ts';

export function readSettings(cwd: string): DocLinksSettings {
  const path = join(cwd, 'package.json');
  if (!existsSync(path)) return DEFAULT_SETTINGS;
  const manifest: unknown = JSON.parse(readFileSync(path, 'utf8'));
  const settings: unknown = typeof manifest === 'object' && manifest !== null ? Reflect.get(manifest, 'docLinks') : undefined;
  return typeof settings === 'object' && settings !== null ? { ...DEFAULT_SETTINGS, ...Object.fromEntries(Object.entries(settings).filter(([key]) => key in DEFAULT_SETTINGS)) } : DEFAULT_SETTINGS;
}
