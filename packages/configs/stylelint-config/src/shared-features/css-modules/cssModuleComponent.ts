import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import type { ComponentFile } from '#src/shared-features/css-modules/CssModulesTypes.ts';

const MODULE_SUFFIX = '.module.css';

export function moduleName(file: string | undefined): string | undefined {
  if (file === undefined || !file.endsWith(MODULE_SUFFIX)) return undefined;
  return basename(file, MODULE_SUFFIX);
}

export function cssModuleComponent(file: string, name: string): ComponentFile | undefined {
  const path = join(dirname(file), `${name}.tsx`);
  return existsSync(path) ? { name: `${name}.tsx`, text: readFileSync(path, 'utf8') } : undefined;
}
