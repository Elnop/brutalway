import { existsSync, readFileSync, statSync } from 'node:fs';
import { oklab } from '#src/features/color-tokens/lib/oklab.ts';
import type { ColorToken } from '#src/features/color-tokens/ColorTokensTypes.ts';

const cache = new Map<string, { mtime: number; tokens: ColorToken[] }>();

function colorProperties(css: string): ColorToken[] {
  return [...css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/gu)].flatMap((match) => {
    const color = oklab(match[2] ?? '');
    return color === undefined ? [] : [{ name: match[1] ?? '', color }];
  });
}

export function readColorTokens(path: string): ColorToken[] {
  if (!existsSync(path)) return [];
  const mtime = statSync(path).mtimeMs;
  const cached = cache.get(path);
  if (cached?.mtime === mtime) return cached.tokens;
  const tokens = colorProperties(readFileSync(path, 'utf8'));
  cache.set(path, { mtime, tokens });
  return tokens;
}
