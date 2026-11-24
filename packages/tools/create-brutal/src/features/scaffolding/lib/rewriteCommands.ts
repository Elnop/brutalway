import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  CONVERTED_FILES,
  SKIPPED_FILES,
  UNCONVERTED_FOLDERS,
} from '#src/features/scaffolding/ScaffoldConfig.ts';
import { pnpmCommands } from '#src/shared/stack/lib/pnpmCommands.ts';

function convertedFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name))
    .filter((path) => {
      const parts = relative(dir, path).split('/');
      return (
        !parts.some((part) => UNCONVERTED_FOLDERS.includes(part)) &&
        !SKIPPED_FILES.includes(parts.at(-1) ?? '') &&
        CONVERTED_FILES.test(`/${parts.join('/')}`)
      );
    });
}

export function rewriteCommands(dir: string): void {
  for (const path of convertedFiles(dir)) {
    const text = readFileSync(path, 'utf8');
    const converted = pnpmCommands(text);
    if (converted !== text) writeFileSync(path, converted);
  }
}
