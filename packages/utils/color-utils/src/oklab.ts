import type { Oklab } from '#src/shared/types/OklabTypes.ts';
import { fromHex } from '#src/shared/lib/fromHex.ts';
import { fromRgbChannels } from '#src/shared/lib/fromRgbChannels.ts';

function channels(body: string): number[] {
  return body
    .split(/[\s,/]+/u)
    .filter(Boolean)
    .map((part) => (part.endsWith('%') ? Number.parseFloat(part) / 100 : Number.parseFloat(part)));
}

function fromOklch(lightness: number, chroma: number, hueDegrees: number): Oklab {
  const hue = (hueDegrees * Math.PI) / 180;
  return { l: lightness, a: chroma * Math.cos(hue), b: chroma * Math.sin(hue) };
}

export function oklab(value: string): Oklab | undefined {
  const text = value.replaceAll('_', ' ').trim().toLowerCase();
  if (/^#[0-9a-f]{3,8}$/u.test(text)) return fromHex(text);
  const call = /^(rgba?|oklch)\((.*)\)$/u.exec(text);
  if (call === null) return undefined;
  const [first, second, third] = channels(call[2] ?? '');
  if (first === undefined || second === undefined || third === undefined) return undefined;
  return call[1] === 'oklch'
    ? fromOklch(first, second, third)
    : fromRgbChannels(call[2] ?? '', first, second, third);
}

export function oklabDistance(left: Oklab, right: Oklab): number {
  return Math.hypot(left.l - right.l, left.a - right.a, left.b - right.b);
}
