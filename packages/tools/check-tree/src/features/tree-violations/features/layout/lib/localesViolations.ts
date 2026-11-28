import { LOCALES_FOLDER } from '#src/features/tree-violations/features/layout/LayoutConfig.ts';
import type { Violation } from '#src/shared/violations/ViolationTypes.ts';

export function localesViolations(
  name: string,
  check: 'locales' | 'language',
  files: readonly string[],
): Violation[] {
  if (check === 'locales') {
    return files.map((file) => ({
      rule: 'locales-file',
      path: `${name}/${file}`,
      message: `${name} holds ${file}: ${LOCALES_FOLDER}/ holds one folder per language, move it into one`,
    }));
  }
  return files
    .filter((file) => !file.endsWith('.json'))
    .map((file) => ({
      rule: 'not-a-locale-file',
      path: `${name}/${file}`,
      message: `${name}/${file} is not a .json file: a language folder holds .json files only`,
    }));
}
