import { typescriptConfig } from '@brutalway/oxlint-config-typescript';
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

const MAX_COMPONENT_PROPS = 6;

const ORCHESTRATOR = 'FunctionDeclaration[id.name=/^[A-Z]\\w*(Container|Layout|Page)$/]';

const PRESENTER_FORMATTING = [
  {
    selector: 'CallExpression > MemberExpression.callee[property.name=/^(toLocaleString|toLocaleDateString|toLocaleTimeString|toFixed)$/]',
    message: 'A presenter renders what it gets: format dates and numbers in the orchestrator or in a hook, and pass the string as a prop.',
  },
  {
    selector: 'MemberExpression[object.name="Intl"]',
    message: 'A presenter renders what it gets: format dates and numbers in the orchestrator or in a hook, and pass the string as a prop.',
  },
  {
    selector: 'CallExpression > MemberExpression.callee[property.name=/^(sort|toSorted|filter|reduce)$/]',
    message: 'A presenter renders what it gets: sort, filter or reduce the list in the orchestrator or in a hook (a selector), and pass the result as a prop. map stays fine for rendering.',
  },
];

const COMPONENT_ROLES = [
  {
    selector: `TSTypeAliasDeclaration[id.name=/Props$/] > TSTypeLiteral > TSPropertySignature:nth-child(${MAX_COMPONENT_PROPS + 1})`,
    message: `A component takes at most ${MAX_COMPONENT_PROPS} props: group the related ones into an object, or split the component.`,
  },
];

const ORCHESTRATOR_ROLE = [
  ...COMPONENT_ROLES,
  {
    selector: `${ORCHESTRATOR}:not(:has(CallExpression[callee.name=/^use[A-Z]/]))`,
    message: 'An XContainer, XLayout or XPage reads state through a hook and hands it to presenters: call the hook here, or rename the component, since it is a presenter.',
  },
];

const STORAGE_MESSAGE = 'Only an xStorage.ts file reads and writes the browser storage: move this call into the storage file of its slice, and import its functions.';

export const reactConfig: OxlintConfig = defineConfig({
  extends: [typescriptConfig],
  plugins: ['typescript', 'react', 'import', 'oxc', 'unicorn'],
  jsPlugins: [
    { name: 'component-props', specifier: fileURLToPath(new URL('./plugin.js', import.meta.url)) },
    { name: 'hook-naming', specifier: fileURLToPath(new URL('./hookNamingPlugin.js', import.meta.url)) },
    { name: 'fetch-placement', specifier: fileURLToPath(new URL('./fetchPlugin.js', import.meta.url)) },
    { name: 'component-roles', specifier: fileURLToPath(new URL('./componentRolesPlugin.js', import.meta.url)) },
    { name: 'hook-files', specifier: fileURLToPath(new URL('./hookFilesPlugin.js', import.meta.url)) },
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
    'react/no-array-index-key': 'error',
    'no-restricted-globals': ['error', { name: 'localStorage', message: STORAGE_MESSAGE }, { name: 'sessionStorage', message: STORAGE_MESSAGE }],
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
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'fetch-placement/no-restricted-syntax': [
          'error',
          {
            selector: 'CallExpression[callee.name=/^use(Layout)?Effect$/] CallExpression[callee.name="fetch"]',
            message: 'No fetch in an effect: server data goes through a query hook, and the request lives in an xClient.ts.',
          },
          {
            selector: 'CallExpression[callee.name="fetch"]:not(CallExpression[callee.name=/^use(Layout)?Effect$/] CallExpression)',
            message: 'Only an xClient.ts file calls fetch: move this request into the client of that API.',
          },
        ],
      },
    },
    { files: ['**/*Client.ts'], rules: { 'fetch-placement/no-restricted-syntax': 'off' } },
    { files: ['**/*Storage.ts'], rules: { 'no-restricted-globals': 'off' } },
    { files: ['**/*.tsx'], rules: { 'component-roles/no-restricted-syntax': ['error', ...COMPONENT_ROLES, ...PRESENTER_FORMATTING] } },
    { files: ['**/*Container.tsx', '**/*Layout.tsx', '**/*Page.tsx'], rules: { 'component-roles/no-restricted-syntax': ['error', ...ORCHESTRATOR_ROLE] } },
    {
      files: ['**/use[A-Z]*.tsx'],
      rules: { 'hook-files/no-restricted-syntax': ['error', { selector: 'Program', message: 'A hook file is a useX.ts: move the JSX into a component and rename this file.' }] },
    },
    { files: ['**/*.test.tsx', 'e2e/**'], rules: { 'component-props/no-restricted-syntax': 'off', 'component-roles/no-restricted-syntax': 'off' } },
  ],
});
