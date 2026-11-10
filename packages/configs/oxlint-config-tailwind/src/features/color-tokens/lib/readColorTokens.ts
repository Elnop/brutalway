import { createRequire } from 'node:module';
import { isAbsolute, join } from 'node:path';
import { createColorTokenReader } from '@brutalway/color-utils/createColorTokenReader';
import { oklab } from '@brutalway/color-utils/oklab';
import type { ColorToken } from '@brutalway/color-utils/ColorTypes';

function colorVariables(css: string): ColorToken[] {
  const themes = [...css.matchAll(/@theme[^{]*\{([^}]*)\}/gu)].map((match) => match[1] ?? '');
  return themes.flatMap((theme) =>
    [...theme.matchAll(/--color-([\w-]+)\s*:\s*([^;]+);/gu)].map((match) => ({
      name: match[1] ?? '',
      color: oklab(match[2] ?? ''),
    })),
  );
}

const readCached = createColorTokenReader(colorVariables);

export function readColorTokens(stylesheet: string, cwd: string): ColorToken[] {
  return readCached(isAbsolute(stylesheet) ? stylesheet : join(cwd, stylesheet));
}

export function readPalette(cwd: string): ColorToken[] {
  try {
    return readCached(createRequire(join(cwd, 'package.json')).resolve('tailwindcss/theme.css'));
  } catch {
    return [];
  }
}
