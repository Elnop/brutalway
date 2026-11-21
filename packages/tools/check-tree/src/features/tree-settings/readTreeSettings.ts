import { existsSync, readFileSync } from 'node:fs';
import type { TreeSettings } from '#src/features/tree-settings/TreeSettingsTypes.ts';

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

const SETTING_CHECKS = new Map<string, (value: unknown) => boolean>([
  ['categories', isStringList],
  ['rootEntries', (value) => typeof value === 'boolean'],
  ['platforms', isStringList],
]);

function isTreeSettings(value: unknown): value is TreeSettings {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  return Object.entries(value).every(([key, entry]) => SETTING_CHECKS.get(key)?.(entry) === true);
}

export function readTreeSettings(file: string): TreeSettings {
  if (!existsSync(file)) return {};
  const parsed: unknown = JSON.parse(readFileSync(file, 'utf8'));
  if (typeof parsed !== 'object' || parsed === null || !('check-tree' in parsed)) return {};
  const config = parsed['check-tree'];
  if (!isTreeSettings(config)) {
    throw new Error(
      `the "check-tree" key of ${file} holds an object with categories (a list of strings), rootEntries (a boolean) and platforms (a list of strings), all optional`,
    );
  }
  return config;
}
