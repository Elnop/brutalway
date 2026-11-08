import type { Oklab } from '#src/shared/types/OklabTypes.ts';

function toLinear(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function fromRgb(red: number, green: number, blue: number): Oklab {
  const [r, g, b] = [toLinear(red), toLinear(green), toLinear(blue)];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

function fromHex(hex: string): Oklab | undefined {
  const short = hex.length <= 5;
  const digits = [1, 2, 3].map((index) => (short ? hex.charAt(index).repeat(2) : hex.slice(index * 2 - 1, index * 2 + 1)));
  const [red, green, blue] = digits.map((pair) => Number.parseInt(pair, 16) / 255);
  if (red === undefined || green === undefined || blue === undefined || [red, green, blue].some(Number.isNaN)) return undefined;
  return fromRgb(red, green, blue);
}

function scale(channel: number, raw: string | undefined): number {
  return raw?.endsWith('%') === true ? channel : channel / 255;
}

function channels(body: string): number[] {
  return body
    .split(/[\s,/]+/u)
    .filter(Boolean)
    .map((part) => (part.endsWith('%') ? Number.parseFloat(part) / 100 : Number.parseFloat(part)));
}

export function oklab(value: string): Oklab | undefined {
  const text = value.replaceAll('_', ' ').trim().toLowerCase();
  if (/^#[0-9a-f]{3,8}$/u.test(text)) return fromHex(text);
  const call = /^(rgba?|oklch)\((.*)\)$/u.exec(text);
  if (call === null) return undefined;
  const [first, second, third] = channels(call[2] ?? '');
  if (first === undefined || second === undefined || third === undefined) return undefined;
  if (call[1] === 'oklch') {
    const hue = (third * Math.PI) / 180;
    return { l: first, a: second * Math.cos(hue), b: second * Math.sin(hue) };
  }
  const raws = (call[2] ?? '').split(/[\s,/]+/u).filter(Boolean);
  return fromRgb(scale(first, raws[0]), scale(second, raws[1]), scale(third, raws[2]));
}

export function oklabDistance(left: Oklab, right: Oklab): number {
  return Math.hypot(left.l - right.l, left.a - right.a, left.b - right.b);
}
