import type { DummyRuleMap } from 'oxlint';

const STYLE_SHEET =
  "CallExpression[callee.object.name='StyleSheet'][callee.property.name='create']";
const STYLE_ATTRIBUTE = 'JSXAttribute[name.name=/^style$|Style$/u]';
const SIZE_KEYS =
  '/^((margin|padding|inset)(Top|Bottom|Left|Right|Start|End|Horizontal|Vertical)?|gap|rowGap|columnGap|top|bottom|left|right|start|end|(min|max)?(Width|Height)|width|height|flexBasis|fontSize|lineHeight|letterSpacing|border(Top|Bottom|Left|Right|Start|End)?Width|border(Top|Bottom)?(Left|Right|Start|End)?Radius|outlineWidth|outlineOffset)$/u';
const NUMBER = 'Literal[raw=/^[0-9.]/u]';

const FROM_THEME =
  'comes from the theme: replace the literal with a token of the theme object, and add the token there if it is missing.';

export const themeStylesRules: DummyRuleMap = {
  'theme-styles/no-restricted-syntax': [
    'error',
    {
      selector: `${STYLE_SHEET} Property[key.name=/[cC]olor$/u] > :matches(Literal[value!='transparent'], TemplateLiteral)`,
      message: `A color ${FROM_THEME}`,
    },
    {
      selector: `${STYLE_SHEET} Property[key.name=${SIZE_KEYS}] > :matches(${NUMBER}:not([raw='0']), UnaryExpression)`,
      message: `A size or a spacing ${FROM_THEME} 0 and percentages stay literal.`,
    },
    {
      selector: `${STYLE_SHEET} Property[key.name='fontFamily'] > Literal`,
      message: `A font ${FROM_THEME}`,
    },
    {
      selector: `${STYLE_SHEET} Property[key.name=/^(boxShadow|textShadow)$/u] > :matches(Literal[value!='none'], TemplateLiteral)`,
      message: `A shadow ${FROM_THEME}`,
    },
    {
      selector: `${STYLE_ATTRIBUTE} ObjectExpression`,
      message:
        'No inline style object: declare the style in the StyleSheet.create of this file and pass it as styles.x. A style that depends on a prop picks one of several styles of the sheet.',
    },
  ],
};
