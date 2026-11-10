import { existsSync, readFileSync, statSync } from 'node:fs';
import type { ColorToken } from '#src/shared/types/ColorTokenTypes.ts';

export function createColorTokenReader(
  parse: (css: string) => ColorToken[],
): (path: string) => ColorToken[] {
  const cache = new Map<string, { mtime: number; tokens: ColorToken[] }>();
  return (path) => {
    if (!existsSync(path)) return [];
    const mtime = statSync(path).mtimeMs;
    const cached = cache.get(path);
    if (cached?.mtime === mtime) return cached.tokens;
    const tokens = parse(readFileSync(path, 'utf8'));
    cache.set(path, { mtime, tokens });
    return tokens;
  };
}
