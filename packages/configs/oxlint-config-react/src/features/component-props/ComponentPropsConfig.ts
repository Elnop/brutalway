import type { OxlintOverride } from 'oxlint';

const COMPONENT_PROPS_MESSAGE = 'A component types its props with a named type called after it: ComponentProps.';

const COMPONENT_PARAMS =
  ':matches(FunctionDeclaration[id.name=/^[A-Z]/], VariableDeclarator[id.name=/^[A-Z]/] > :matches(ArrowFunctionExpression, FunctionExpression)) > :matches(ObjectPattern, Identifier).params';

const COMPONENT_PROPS = [
  { selector: `${COMPONENT_PARAMS}[typeAnnotation=null]`, message: COMPONENT_PROPS_MESSAGE },
  { selector: `${COMPONENT_PARAMS} > TSTypeAnnotation > TSTypeLiteral`, message: COMPONENT_PROPS_MESSAGE },
  { selector: `${COMPONENT_PARAMS} > TSTypeAnnotation > TSTypeReference > Identifier.typeName[name!=/^[A-Z]\\w*Props$/]`, message: COMPONENT_PROPS_MESSAGE },
];

const CALLBACK_PROPS = [
  {
    selector: 'TSTypeAliasDeclaration[id.name=/Props$/] TSPropertySignature[key.name!=/^on[A-Z]/][typeAnnotation.typeAnnotation.type="TSFunctionType"]',
    message: 'A callback prop is named onX: onSelect, onChange.',
  },
];

export const componentPropsOverrides: OxlintOverride[] = [
  { files: ['**/*.tsx'], rules: { 'component-props/no-restricted-syntax': ['error', ...COMPONENT_PROPS, ...CALLBACK_PROPS] } },
  { files: ['**/*Types.ts'], rules: { 'component-props/no-restricted-syntax': ['error', ...CALLBACK_PROPS] } },
];
