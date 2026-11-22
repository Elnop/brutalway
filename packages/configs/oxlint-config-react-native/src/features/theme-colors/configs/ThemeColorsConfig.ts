import type { DummyRuleMap } from 'oxlint';
import { CSS_COLOR_NAMES } from '#src/features/theme-colors/configs/ColorNamesConfig.ts';

const COLOR_VALUE = '/^(#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$|(rgba?|hsla?)\\()/u';
const COLOR_TEMPLATE = '/^(#[0-9a-fA-F]{3}|(rgba?|hsla?)\\()/u';
const COLOR_KEY = '/[cC]olor$/u';
const MESSAGE =
  'A color comes from the theme: replace the literal with a token of the theme object, and add the token there if it is missing. A module that computes colors is listed in colorFiles.';

export const themeColorsRules: DummyRuleMap = {
  'theme-colors/no-restricted-syntax': [
    'error',
    { selector: `Literal[value=${COLOR_VALUE}]`, message: MESSAGE },
    {
      selector: `TemplateLiteral[expressions.length=0] > TemplateElement[value.raw=${COLOR_TEMPLATE}]`,
      message: MESSAGE,
    },
    {
      selector: `:matches(JSXAttribute[name.name=${COLOR_KEY}], Property[key.name=${COLOR_KEY}]) > Literal[value=/^(${CSS_COLOR_NAMES.join('|')})$/u]`,
      message: MESSAGE,
    },
  ],
};
