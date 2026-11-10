import type { Oklab } from '#src/shared/types/OklabTypes.ts';
import { fromRgb } from '#src/shared/lib/fromRgb.ts';

export function fromHex(hex: string): Oklab | undefined {
  const short = hex.length <= 5;
  const digits = [1, 2, 3].map((index) => (short ? hex.charAt(index).repeat(2) : hex.slice(index * 2 - 1, index * 2 + 1)));
  const [red, green, blue] = digits.map((pair) => Number.parseInt(pair, 16) / 255);
  if (red === undefined || green === undefined || blue === undefined || [red, green, blue].some(Number.isNaN)) return undefined;
  return fromRgb(red, green, blue);
}
