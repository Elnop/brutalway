import type { ESTree } from '@oxlint/plugins';
import { oklab } from '@brutalway/color-utils/oklab';
import type { ColorToken } from '@brutalway/color-utils/ColorTypes';
import { classNames, classStrings } from '#src/shared-features/tailwind-classes/lib/classStrings.ts';
import { tailwindClass } from '#src/shared-features/tailwind-classes/lib/tailwindClass.ts';
import { COLOR_LITERAL } from '#src/features/color-tokens/ColorTokensConfig.ts';
import type { Offense, Report } from '#src/features/color-tokens/ColorTokensTypes.ts';

const COLOR_UTILITY =
  /^-?(bg|text|border(?:-[xytrblse])?|outline|ring(?:-offset)?|inset-ring|shadow|inset-shadow|drop-shadow|text-shadow|fill|stroke|accent|caret|decoration|placeholder|divide|from|via|to)-(.+)$/u;
const PALETTE_COLOR =
  /^((?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|mauve|olive|mist|taupe)-(?:50|[1-9]00|950)|black|white)(?:\/.+)?$/u;

function literalClassOffense(name: string, text: string, format: (token: string) => string): Offense | undefined {
  const literal = COLOR_LITERAL.exec(text)?.[0];
  return literal === undefined ? undefined : { text: name, color: oklab(literal), format };
}

function colorUtilityOffense(name: string, match: RegExpExecArray, palette: ColorToken[]): Offense | undefined {
  const [, prefix = '', value = ''] = match;
  function format(token: string) {
    return `${prefix}-${token}`;
  }
  const paletteColor = PALETTE_COLOR.exec(value)?.[1];
  if (paletteColor !== undefined) return { text: name, color: palette.find((token) => token.name === paletteColor)?.color, format };
  const arbitrary = /^\[(.+)\](?:\/.+)?$/u.exec(value)?.[1];
  return arbitrary === undefined ? undefined : literalClassOffense(name, arbitrary, format);
}

function classOffense(name: string, palette: ColorToken[]): Offense | undefined {
  const { utility } = tailwindClass(name);
  const arbitraryProperty = /^\[[a-z-]+:(.+)\]$/u.exec(utility);
  if (arbitraryProperty !== null) return literalClassOffense(name, arbitraryProperty[1] ?? '', (token) => `var(--color-${token})`);
  const match = COLOR_UTILITY.exec(utility);
  return match === null ? undefined : colorUtilityOffense(name, match, palette);
}

export function reportClassOffenses(attribute: ESTree.JSXAttribute, palette: ColorToken[], report: Report): void {
  for (const entry of classNames(classStrings(attribute))) {
    const offense = classOffense(entry.name, palette);
    if (offense !== undefined) report(entry.node, offense);
  }
}
