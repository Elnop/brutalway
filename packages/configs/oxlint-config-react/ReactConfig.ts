import { typescriptConfig } from '@brutal/oxlint-config-typescript';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

const COMPONENT_PROPS = [
  {
    selector:
      ':matches(FunctionDeclaration[id.name=/^[A-Z]/], VariableDeclarator[id.name=/^[A-Z]/] > :matches(ArrowFunctionExpression, FunctionExpression)) > :matches(ObjectPattern, Identifier).params[typeAnnotation=null]',
    message: 'A component types its props with a named type called after it: ComponentProps.',
  },
  {
    selector:
      ':matches(FunctionDeclaration[id.name=/^[A-Z]/], VariableDeclarator[id.name=/^[A-Z]/] > :matches(ArrowFunctionExpression, FunctionExpression)) > :matches(ObjectPattern, Identifier).params > TSTypeAnnotation > TSTypeLiteral',
    message: 'A component types its props with a named type called after it: ComponentProps.',
  },
  {
    selector:
      ':matches(FunctionDeclaration[id.name=/^[A-Z]/], VariableDeclarator[id.name=/^[A-Z]/] > :matches(ArrowFunctionExpression, FunctionExpression)) > :matches(ObjectPattern, Identifier).params > TSTypeAnnotation > TSTypeReference > Identifier.typeName[name!=/^[A-Z]\\w*Props$/]',
    message: 'A component types its props with a named type called after it: ComponentProps.',
  },
];

const CALLBACK_PROPS = [
  {
    selector: 'TSTypeAliasDeclaration[id.name=/Props$/] TSPropertySignature[key.name!=/^on[A-Z]/][typeAnnotation.typeAnnotation.type="TSFunctionType"]',
    message: 'A callback prop is named onX: onSelect, onChange.',
  },
];

export const reactConfig: OxlintConfig = defineConfig({
  extends: [typescriptConfig],
  plugins: ['typescript', 'react', 'import', 'oxc', 'unicorn'],
  jsPlugins: [
    { name: 'component-props', specifier: fileURLToPath(new URL('./plugin.js', import.meta.url)) },
    { name: 'hook-naming', specifier: fileURLToPath(new URL('./hookNamingPlugin.js', import.meta.url)) },
  ],
  env: { browser: true, es2024: true },
  rules: {
    'react/rules-of-hooks': 'error',
    'react/hooks': 'off',
    'react/immutability': 'off',
    'react/exhaustive-deps': 'error',
    'react/only-export-components': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
  },
  overrides: [
    { files: ['**/*.tsx'], rules: { 'component-props/no-restricted-syntax': ['error', ...COMPONENT_PROPS, ...CALLBACK_PROPS] } },
    { files: ['**/*Types.ts'], rules: { 'component-props/no-restricted-syntax': ['error', ...CALLBACK_PROPS] } },
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'hook-naming/no-restricted-syntax': ['error', { selector: 'ExportNamedDeclaration > FunctionDeclaration[id.name=/^use[A-Z]/]', message: 'A hook lives in its own useX.ts file.' }],
      },
    },
    {
      files: ['**/use*.ts', '**/use*.tsx'],
      rules: {
        'hook-naming/no-restricted-syntax': [
          'error',
          { selector: 'ExportNamedDeclaration > FunctionDeclaration[id.name!=/^use[A-Z]/]', message: 'A useX.ts file only exports hooks named useX: move this function out of it.' },
        ],
      },
    },
    { files: ['**/*.test.tsx', 'e2e/**'], rules: { 'component-props/no-restricted-syntax': 'off' } },
  ],
});
