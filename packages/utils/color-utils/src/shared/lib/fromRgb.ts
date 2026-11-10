import type { Oklab } from '#src/shared/types/OklabTypes.ts';

function toLinear(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function cubeRootLms(red: number, green: number, blue: number): [number, number, number] {
  const [r, g, b] = [toLinear(red), toLinear(green), toLinear(blue)];
  return [
    Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b),
    Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b),
    Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b),
  ];
}

export function fromRgb(red: number, green: number, blue: number): Oklab {
  const [l, m, s] = cubeRootLms(red, green, blue);
  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}
