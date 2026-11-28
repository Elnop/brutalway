import { basename } from 'node:path';
import {
  LANGUAGE_FOLDER,
  LOCALES_FOLDER,
} from '#src/features/tree-violations/features/layout/LayoutConfig.ts';
import type { ChildLayer } from '#src/features/tree-violations/features/layout/LayoutTypes.ts';

function languageFolder(path: string): ChildLayer {
  if (LANGUAGE_FOLDER.test(basename(path))) return { layer: 'language', violations: [] };
  return {
    layer: 'free',
    violations: [
      {
        rule: 'not-a-language-folder',
        path,
        message: `${path} is not a language folder: ${LOCALES_FOLDER}/ holds one folder per language, named like en or fr-CA`,
      },
    ],
  };
}

function insideLanguageFolder(path: string): ChildLayer {
  return {
    layer: 'free',
    violations: [
      {
        rule: 'not-a-locale-file',
        path,
        message: `${path} is inside a language folder: a language folder holds .json files only`,
      },
    ],
  };
}

export function localesChildLayer(layer: 'locales' | 'language', path: string): ChildLayer {
  return layer === 'locales' ? languageFolder(path) : insideLanguageFolder(path);
}
