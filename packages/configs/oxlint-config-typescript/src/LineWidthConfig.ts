import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';
import { siblingModule } from '#src/shared/plugin-path/siblingModule.ts';

const MAX_WIDTH = 100;
const STRING = ':matches(Literal[raw=/^["\']/], TemplateLiteral[expressions.length=0])';
const LEFT_STRING =
  ":matches([left.right.type='Literal'][left.right.raw=/^[\"']/], [left.right.type='TemplateLiteral'][left.right.expressions.length=0])";
const SPLIT_STRING = 'Write a long text as one literal: do not cut it into pieces joined with +.';

const SPLIT_SELECTORS = [
  {
    selector: `BinaryExpression[operator='+']:has(> ${STRING}.left):has(> ${STRING}.right)`,
    message: SPLIT_STRING,
  },
  {
    selector: `BinaryExpression[operator='+'][left.type='BinaryExpression'][left.operator='+']${LEFT_STRING}:has(> ${STRING}.right)`,
    message: SPLIT_STRING,
  },
  {
    selector: 'TemplateElement[value.raw=/\\\\\\n/]',
    message: 'Do not end a line with a backslash inside a template literal.',
  },
];

export const lineWidthConfig: OxlintConfig = defineConfig({
  jsPlugins: [{ name: 'line-width', specifier: siblingModule('lineWidthPlugin') }],
  rules: {
    'line-width/max-len': ['error', { code: MAX_WIDTH }],
    'line-width/no-restricted-syntax': ['error', ...SPLIT_SELECTORS],
    'no-multi-str': 'error',
    'no-useless-concat': 'error',
    'prefer-template': 'error',
  },
});
