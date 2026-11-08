import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';
import { classNames, classStrings, isClassAttribute } from '#src/shared-features/tailwind-classes/lib/classStrings.ts';
import { oklab, oklabDistance } from '@brutalway/color-utils/oklab';
import { readColorTokens, readPalette } from '#src/features/color-tokens/lib/readColorTokens.ts';
import { tailwindClass } from '#src/shared-features/tailwind-classes/lib/tailwindClass.ts';
import type { ColorToken, Oklab } from '@brutalway/color-utils/ColorTypes';

const DEFAULT_STYLESHEET = 'src/app/globals.css';
const COLOR_UTILITY =
  /^-?(bg|text|border(?:-[xytrblse])?|outline|ring(?:-offset)?|inset-ring|shadow|inset-shadow|drop-shadow|text-shadow|fill|stroke|accent|caret|decoration|placeholder|divide|from|via|to)-(.+)$/u;
const PALETTE_COLOR =
  /^((?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|mauve|olive|mist|taupe)-(?:50|[1-9]00|950)|black|white)(?:\/.+)?$/u;
const COLOR_LITERAL = /#[0-9a-f]{3,8}(?![0-9a-z])|\b(?:rgba?|hsla?|hwb|oklch|oklab|lab|lch|color)\([^)]*\)/iu;
const COLOR_ATTRIBUTES = new Set(['fill', 'stroke', 'color', 'stopColor', 'floodColor', 'lightingColor']);
const SUGGESTIONS = 3;

type Offense = { text: string; color: Oklab | undefined; format: (token: string) => string };

function closestTokens(tokens: ColorToken[], color: Oklab | undefined): ColorToken[] {
  if (color === undefined) return tokens.slice(0, SUGGESTIONS);
  return tokens
    .filter((token) => token.color !== undefined)
    .toSorted((left, right) => oklabDistance(left.color ?? color, color) - oklabDistance(right.color ?? color, color))
    .slice(0, SUGGESTIONS);
}

function classOffense(name: string, palette: ColorToken[]): Offense | undefined {
  const { utility } = tailwindClass(name);
  const arbitraryProperty = /^\[[a-z-]+:(.+)\]$/u.exec(utility);
  if (arbitraryProperty !== null) {
    const literal = COLOR_LITERAL.exec(arbitraryProperty[1] ?? '')?.[0];
    return literal === undefined ? undefined : { text: name, color: oklab(literal), format: (token) => `var(--color-${token})` };
  }
  const match = COLOR_UTILITY.exec(utility);
  if (match === null) return undefined;
  const [, prefix = '', value = ''] = match;
  function format(token: string) {
    return `${prefix}-${token}`;
  }
  const paletteColor = PALETTE_COLOR.exec(value)?.[1];
  if (paletteColor !== undefined) return { text: name, color: palette.find((token) => token.name === paletteColor)?.color, format };
  const arbitrary = /^\[(.+)\](?:\/.+)?$/u.exec(value)?.[1];
  const literal = arbitrary === undefined ? undefined : COLOR_LITERAL.exec(arbitrary)?.[0];
  return literal === undefined ? undefined : { text: name, color: oklab(literal), format };
}

function literalOffense(text: string): Offense | undefined {
  const literal = COLOR_LITERAL.exec(text)?.[0];
  return literal === undefined ? undefined : { text: literal, color: oklab(literal), format: (token) => `var(--color-${token})` };
}

function styleValues(attribute: ESTree.JSXAttribute): ESTree.Node[] {
  const value = attribute.value;
  if (value?.type !== 'JSXExpressionContainer' || value.expression.type !== 'ObjectExpression') return [];
  return value.expression.properties.flatMap((property) => (property.type === 'Property' ? [property.value] : []));
}

function colorValues(attribute: ESTree.JSXAttribute, name: string): ESTree.Node[] {
  if (name === 'style') return styleValues(attribute);
  return COLOR_ATTRIBUTES.has(name) && attribute.value !== null ? [attribute.value] : [];
}

function staticText(node: ESTree.Node): string | undefined {
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node.type === 'TemplateLiteral') return node.quasis.map((quasi) => quasi.value.cooked ?? quasi.value.raw).join(' ');
  if (node.type === 'JSXExpressionContainer' && node.expression.type !== 'JSXEmptyExpression') return staticText(node.expression);
  return undefined;
}

function stylesheetOption(option: unknown): string {
  return typeof option === 'object' && option !== null && 'stylesheet' in option && typeof option.stylesheet === 'string' ? option.stylesheet : DEFAULT_STYLESHEET;
}

export const colorTokens = defineRule({
  meta: {
    type: 'problem',
    docs: { description: 'Colors come from the tokens declared under @theme: no Tailwind palette class, no arbitrary color, no color literal in style, fill or stroke.' },
    messages: {
      notToken: '{{text}} is not a color token. Use a color declared under @theme in {{stylesheet}}, closest: {{closest}}.',
      noTokens: '{{text}} is not a color token. Declare the colors as --color-* under @theme in {{stylesheet}} and use those.',
    },
    schema: [{ type: 'object', properties: { stylesheet: { type: 'string' } }, additionalProperties: false }],
  },
  create(context) {
    const stylesheet = stylesheetOption(context.options[0]);
    const tokens = readColorTokens(stylesheet, context.cwd);
    function report(node: ESTree.Node, offense: Offense) {
      const closest = closestTokens(tokens, offense.color).map((token) => offense.format(token.name));
      if (closest.length === 0) context.report({ node, messageId: 'noTokens', data: { text: offense.text, stylesheet } });
      else context.report({ node, messageId: 'notToken', data: { text: offense.text, stylesheet, closest: closest.join(', ') } });
    }
    return {
      JSXAttribute(attribute) {
        if (attribute.name.type !== 'JSXIdentifier') return;
        const name = attribute.name.name;
        if (isClassAttribute(attribute)) {
          const palette = readPalette(context.cwd);
          for (const entry of classNames(classStrings(attribute))) {
            const offense = classOffense(entry.name, palette);
            if (offense !== undefined) report(entry.node, offense);
          }
          return;
        }
        for (const value of colorValues(attribute, name)) {
          const text = staticText(value);
          const offense = text === undefined ? undefined : literalOffense(text);
          if (offense !== undefined) report(value, offense);
        }
      },
    };
  },
});
