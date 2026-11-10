import { createColorTokenReader } from '@brutalway/lint-utils/createColorTokenReader';
import { oklab } from '@brutalway/lint-utils/oklab';
import type { ColorToken } from '@brutalway/lint-utils/ColorTypes';

function colorProperties(css: string): ColorToken[] {
  return [...css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/gu)].flatMap((match) => {
    const color = oklab(match[2] ?? '');
    return color === undefined ? [] : [{ name: match[1] ?? '', color }];
  });
}

const readCached = createColorTokenReader(colorProperties);

export function readColorTokens(path: string): ColorToken[] {
  return readCached(path);
}
