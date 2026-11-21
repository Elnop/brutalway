import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ExceptionSettings } from '#src/features/settings/SettingsTypes.ts';

function isCountRecord(value: unknown): value is Record<string, number> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((count) => Number.isInteger(count) && Number(count) >= 0)
  );
}

export function readSettings(cwd: string): ExceptionSettings {
  const path = join(cwd, 'package.json');
  if (!existsSync(path)) return { newRules: {} };
  const manifest: unknown = JSON.parse(readFileSync(path, 'utf8'));
  const settings: unknown =
    typeof manifest === 'object' && manifest !== null
      ? Reflect.get(manifest, 'check-exceptions')
      : undefined;
  if (settings === undefined) return { newRules: {} };
  const newRules: unknown =
    typeof settings === 'object' && settings !== null
      ? Reflect.get(settings, 'newRules')
      : undefined;
  if (newRules !== undefined && !isCountRecord(newRules)) {
    throw new Error(
      'check-exceptions: the "check-exceptions" key of package.json holds { "newRules": { "<rule>": <count> } }',
    );
  }
  return { newRules: newRules ?? {} };
}
