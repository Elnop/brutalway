import { existsSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { isAbsolute, join } from 'node:path';
import { oklab } from '#src/features/color-tokens/lib/oklab.ts';
import type { ColorToken } from '#src/features/color-tokens/ColorTokensTypes.ts';

const cache = new Map<string, { mtime: number; tokens: ColorToken[] }>();

function colorVariables(css: string): ColorToken[] {
  const themes = [...css.matchAll(/@theme[^{]*\{([^}]*)\}/gu)].map((match) => match[1] ?? '');
  return themes.flatMap((theme) => [...theme.matchAll(/--color-([\w-]+)\s*:\s*([^;]+);/gu)].map((match) => ({ name: match[1] ?? '', color: oklab(match[2] ?? '') })));
}

function readCached(path: string): ColorToken[] {
  if (!existsSync(path)) return [];
  const mtime = statSync(path).mtimeMs;
  const cached = cache.get(path);
  if (cached?.mtime === mtime) return cached.tokens;
  const tokens = colorVariables(readFileSync(path, 'utf8'));
  cache.set(path, { mtime, tokens });
  return tokens;
}

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
