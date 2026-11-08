import { existsSync, readFileSync, writeFileSync } from 'node:fs';

export function readJsonFile(path: string, fallback: unknown): unknown {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function writeJsonFile(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}
