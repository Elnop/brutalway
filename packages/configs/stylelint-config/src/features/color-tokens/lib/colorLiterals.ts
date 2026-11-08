import { NAMED_COLORS } from '#src/features/color-tokens/ColorsConfig.ts';

const HEX = /#[0-9a-f]{3,8}(?![\w-])/giu;
const COLOR_FUNCTION = /\b(?:rgba?|hsla?|hwb|oklch|oklab|lab|lch|color)\([^)]*\)/giu;
const NAMED_COLOR_PROPERTY = /color|background|border|outline|shadow|fill|stroke|caret|accent|decoration|column-rule/u;

function withoutStringsAndUrls(value: string): string {
  return value.replaceAll(/url\([^)]*\)|'[^']*'|"[^"]*"/gu, ' ');
}

export function colorLiterals(property: string, value: string): string[] {
  const text = withoutStringsAndUrls(value);
  const literals = [...text.matchAll(HEX), ...text.matchAll(COLOR_FUNCTION)].map((match) => match[0]);
  if (!NAMED_COLOR_PROPERTY.test(property)) return literals;
  const words = text.replaceAll(/var\([^)]*\)|--[\w-]+/gu, ' ').match(/[a-z]+/giu) ?? [];
  return [...literals, ...words.filter((word) => NAMED_COLORS.has(word.toLowerCase()))];
}
