import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_SETTINGS } from '#src/shared-features/docs/DocLengthConfig.ts';
import type { DocLengthSettings } from '#src/shared-features/docs/DocLengthTypes.ts';

function fromPackage(cwd: string): Partial<DocLengthSettings> {
  const path = join(cwd, 'package.json');
  if (!existsSync(path)) return {};
  const manifest: unknown = JSON.parse(readFileSync(path, 'utf8'));
  const settings: unknown = typeof manifest === 'object' && manifest !== null ? Reflect.get(manifest, 'docLength') : undefined;
  return typeof settings === 'object' && settings !== null ? Object.fromEntries(Object.entries(settings).filter(([key]) => key in DEFAULT_SETTINGS)) : {};
}

export function readSettings(cwd: string, overrides: Partial<DocLengthSettings>): DocLengthSettings {
  return { ...DEFAULT_SETTINGS, ...fromPackage(cwd), ...overrides };
}
