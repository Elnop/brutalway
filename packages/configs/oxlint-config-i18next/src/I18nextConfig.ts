import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

const WITHOUT_LETTERS =
  '[^A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u024F\\u0370-\\u03FF\\u0400-\\u04FF\\u0590-\\u06FF\\u3040-\\u30FF\\u4E00-\\u9FFF\\uAC00-\\uD7AF]+';

const WITH_LETTERS = '/\\p{L}/u';
const ALL_CAPS = '/^[A-Z_-]+$/';
const READABLE = `[value=${WITH_LETTERS}]:not([value=${ALL_CAPS}])`;
const NATIVE_TAG = "JSXOpeningElement[name.type='JSXIdentifier'][name.name=/^[a-z]/]";
const SUBMIT_INPUT =
  "JSXOpeningElement[name.name='input']:has(> JSXAttribute[name.name='type'][value.value=/^(submit|button|reset)$/])";
const NATIVE_ATTRIBUTES = [
  'aria-description',
  'aria-placeholder',
  'aria-roledescription',
  'aria-valuetext',
];
const TEXT_CALLEE = "[callee.name=/^(toast|alert|confirm|prompt)$/], [callee.object.name='toast']";
const WINDOW_DIALOG =
  '[callee.object.name=/^(window|globalThis)$/][callee.property.name=/^(alert|confirm|prompt)$/]';
const TRANSLATE_IT = 'disallow literal string: translate it with t()';

function readableText(parent: string): string[] {
  return [
    `${parent} > Literal${READABLE}`,
    `${parent} > JSXExpressionContainer > Literal${READABLE}`,
    `${parent} > JSXExpressionContainer > TemplateLiteral:has(> TemplateElement[value.raw=${WITH_LETTERS}])`,
  ];
}

function attributeTexts(owner: string, attribute: string): string[] {
  return readableText(`${owner} > JSXAttribute[name.name='${attribute}']`);
}

function calledText(callee: string): string[] {
  return [
    `CallExpression:matches(${callee}) > Literal.arguments${READABLE}`,
    `CallExpression:matches(${callee}) > TemplateLiteral.arguments:has(> TemplateElement[value.raw=${WITH_LETTERS}])`,
  ];
}

const RESTRICTED_TEXT = [
  ...NATIVE_ATTRIBUTES.flatMap((attribute) => attributeTexts(NATIVE_TAG, attribute)),
  ...attributeTexts(SUBMIT_INPUT, 'value'),
  ...calledText(TEXT_CALLEE),
  ...calledText(WINDOW_DIALOG),
  `AssignmentExpression[left.object.name='document'][left.property.name='title'] > Literal.right${READABLE}`,
  `AssignmentExpression[left.object.name='document'][left.property.name='title'] > TemplateLiteral.right:has(> TemplateElement[value.raw=${WITH_LETTERS}])`,
].map((selector) => ({ selector, message: TRANSLATE_IT }));

export const i18nextConfig: OxlintConfig = defineConfig({
  jsPlugins: [
    { name: 'i18next', specifier: fileURLToPath(import.meta.resolve('eslint-plugin-i18next')) },
    {
      name: 'i18next-attributes',
      specifier: fileURLToPath(new URL('./plugin.js', import.meta.url)),
    },
  ],
  rules: {
    'i18next-attributes/no-restricted-syntax': ['error', ...RESTRICTED_TEXT],
    'i18next/no-literal-string': [
      'error',
      {
        mode: 'jsx-only',
        'should-validate-template': true,
        'jsx-attributes': {
          include: [
            'aria-label',
            'aria-description',
            'aria-placeholder',
            'aria-roledescription',
            'aria-valuetext',
            'placeholder',
            'title',
            'alt',
            'accessibilityLabel',
            'accessibilityHint',
          ],
        },
        words: { exclude: [WITHOUT_LETTERS, '[A-Z_-]+'] },
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      rules: {
        'i18next/no-literal-string': 'off',
        'i18next-attributes/no-restricted-syntax': 'off',
      },
    },
  ],
});
