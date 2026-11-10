import type { Oklab } from '#src/shared/types/OklabTypes.ts';
import { fromRgb } from '#src/shared/lib/fromRgb.ts';

function scale(channel: number, raw: string | undefined): number {
  return raw?.endsWith('%') === true ? channel : channel / 255;
}

export function fromRgbChannels(body: string, red: number, green: number, blue: number): Oklab {
  const raws = body.split(/[\s,/]+/u).filter(Boolean);
  return fromRgb(scale(red, raws[0]), scale(green, raws[1]), scale(blue, raws[2]));
}
