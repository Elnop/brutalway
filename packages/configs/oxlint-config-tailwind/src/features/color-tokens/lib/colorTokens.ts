import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';
import { isClassAttribute } from '#src/shared-features/tailwind-classes/lib/classStrings.ts';
import { oklabDistance } from '@brutalway/color-utils/oklab';
import { readColorTokens, readPalette } from '#src/features/color-tokens/lib/readColorTokens.ts';
import { reportClassOffenses } from '#src/features/color-tokens/lib/reportClassOffenses.ts';
import { reportLiteralOffenses } from '#src/features/color-tokens/lib/reportLiteralOffenses.ts';
import type { ColorToken, Oklab } from '@brutalway/color-utils/ColorTypes';
import type { Offense } from '#src/features/color-tokens/ColorTokensTypes.ts';

const DEFAULT_STYLESHEET = 'src/app/globals.css';
const SUGGESTIONS = 3;

function closestTokens(tokens: ColorToken[], color: Oklab | undefined): ColorToken[] {
  if (color === undefined) return tokens.slice(0, SUGGESTIONS);
  return tokens
    .filter((token) => token.color !== undefined)
    .toSorted((left, right) => oklabDistance(left.color ?? color, color) - oklabDistance(right.color ?? color, color))
    .slice(0, SUGGESTIONS);
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
        if (isClassAttribute(attribute)) reportClassOffenses(attribute, readPalette(context.cwd), report);
        else reportLiteralOffenses(attribute, attribute.name.name, report);
      },
    };
  },
});
