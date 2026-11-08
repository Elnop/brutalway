import { isAbsolute, join, resolve } from 'node:path';
import stylelint from 'stylelint';
import type { Rule } from 'stylelint';
import { colorLiterals } from '#src/features/color-tokens/lib/colorLiterals.ts';
import { oklab, oklabDistance } from '#src/features/color-tokens/lib/oklab.ts';
import { readColorTokens } from '#src/features/color-tokens/lib/readColorTokens.ts';
import type { ColorToken, ColorTokensOptions, Oklab } from '#src/features/color-tokens/ColorTokensTypes.ts';

const { utils } = stylelint;
const ruleName = 'brutalway/color-tokens';
const DEFAULT_STYLESHEET = 'src/app/globals.css';
const SUGGESTIONS = 3;

const messages = utils.ruleMessages(ruleName, {
  notToken: (literal: string, stylesheet: string, closest: string) => `${literal} is not a color token. Use a var() of a color declared in ${stylesheet}, closest: ${closest}.`,
  noTokens: (literal: string, stylesheet: string) => `${literal} is not a color token. Declare the colors as custom properties in ${stylesheet} and use them with var().`,
});

function closestTokens(tokens: ColorToken[], color: Oklab | undefined): ColorToken[] {
  if (color === undefined) return tokens.slice(0, SUGGESTIONS);
  return tokens.toSorted((left, right) => oklabDistance(left.color ?? color, color) - oklabDistance(right.color ?? color, color)).slice(0, SUGGESTIONS);
}

function isOptions(value: unknown): value is ColorTokensOptions {
  return typeof value === 'object' && value !== null && (!('stylesheet' in value) || typeof value.stylesheet === 'string');
}

export function colorTokens(primary: unknown, secondary: unknown): ReturnType<Rule> {
  return (root, result) => {
    const valid = utils.validateOptions(result, ruleName, { actual: primary, possible: [true] }, { actual: secondary, possible: isOptions, optional: true });
    if (!valid) return;
    const stylesheet = isOptions(secondary) ? (secondary.stylesheet ?? DEFAULT_STYLESHEET) : DEFAULT_STYLESHEET;
    const stylesheetPath = isAbsolute(stylesheet) ? stylesheet : join(process.cwd(), stylesheet);
    const file = root.source?.input.file;
    if (file !== undefined && resolve(file) === resolve(stylesheetPath)) return;
    const tokens = readColorTokens(stylesheetPath);
    root.walkDecls((declaration) => {
      for (const literal of colorLiterals(declaration.prop, declaration.value)) {
        const closest = closestTokens(tokens, oklab(literal))
          .map((token) => `var(${token.name})`)
          .join(', ');
        const message = tokens.length === 0 ? messages.noTokens(literal, stylesheet) : messages.notToken(literal, stylesheet, closest);
        utils.report({ result, ruleName, message, node: declaration, word: literal });
      }
    });
  };
}

colorTokens.ruleName = ruleName;
colorTokens.messages = messages;
