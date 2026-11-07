import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

function resolveFromHere(specifier: string) {
  return fileURLToPath(import.meta.resolve(specifier));
}

const EXPORT_PLACEMENT = [
  {
    selector: 'ExportNamedDeclaration > :matches(TSTypeAliasDeclaration, TSInterfaceDeclaration)',
    message: 'Exported types belong in an XTypes.ts file (types/ folder).',
  },
  {
    selector: 'ExportNamedDeclaration > TSEnumDeclaration',
    message: 'Exported constants belong in an XConfig.ts file (configs/ folder).',
  },
  {
    selector:
      'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator:not([init.type=/^(ArrowFunctionExpression|FunctionExpression|NewExpression|ObjectExpression)$/], [init.callee.name=/^define[A-Z]/])',
    message: 'Exported constants belong in an XConfig.ts file (configs/ folder).',
  },
  {
    selector:
      'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ObjectExpression.init:not(:has(> Property[method=true], > Property[value.type=/^(ArrowFunctionExpression|FunctionExpression)$/]))',
    message: 'Exported constants belong in an XConfig.ts file (configs/ folder).',
  },
];

export const typescriptConfig: OxlintConfig = defineConfig({
  plugins: ['typescript', 'import', 'oxc', 'unicorn'],
  jsPlugins: [
    { name: 'export-placement', specifier: fileURLToPath(new URL('./plugin.js', import.meta.url)) },
    { name: 'type-definitions', specifier: fileURLToPath(new URL('./typeDefinitionsPlugin.js', import.meta.url)) },
    { name: 'file-named-after-export', specifier: resolveFromHere('@brutalway/eslint-plugin-file-named-after-export') },
    { name: 'no-comments', specifier: resolveFromHere('eslint-plugin-no-comments') },
    { name: 'check-file', specifier: resolveFromHere('eslint-plugin-check-file') },
  ],
  categories: { correctness: 'error', suspicious: 'error' },
  env: { es2024: true },
  rules: {
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',
    'import/no-duplicates': 'error',
    'typescript/no-floating-promises': 'error',
    'typescript/no-misused-promises': 'error',
    'typescript/await-thenable': 'error',
    'typescript/no-unnecessary-type-assertion': 'error',
    'typescript/consistent-type-imports': 'error',
    'typescript/no-explicit-any': 'error',
    'typescript/switch-exhaustiveness-check': 'error',
    'func-style': ['error', 'declaration'],
    curly: ['error', 'multi-line'],
    'type-definitions/no-restricted-syntax': [
      'error',
      {
        selector: "TSInterfaceDeclaration:not(TSModuleDeclaration[global=true] TSInterfaceDeclaration, TSModuleDeclaration[id.type='Literal'] TSInterfaceDeclaration)",
        message: 'Declare object shapes with type, not interface: interface is only for augmenting a global such as Window or a module such as fastify.',
      },
    ],
    'no-shadow': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'typescript/consistent-return': 'off',
    'oxc/no-barrel-file': ['error', { threshold: 0 }],
    'unicorn/filename-case': ['error', { cases: { camelCase: true, pascalCase: true } }],
    'no-comments/disallowComments': ['error', { allow: ['oxlint-', 'eslint-', '@ts-expect-error', '@ts-ignore', '@ts-nocheck', '/ <reference ', '/usr/bin/env '] }],
    'check-file/no-index': ['error', { errorMessage: 'Barrel files ({{ target }}) are not allowed: import each module by its own path' }],
    'check-file/filename-blocklist': [
      'error',
      {
        '**/types.ts': '*Types.ts',
        '**/*Config.tsx': '*Config.ts',
        '**/shared-features/**/*Container.tsx': 'features/**/*Container.tsx',
        '**/shared-features/**/*Layout.tsx': 'features/**/*Layout.tsx',
        '**/shared-features/**/*Page.tsx': 'features/**/*Page.tsx',
        '**/shared-features/**/*Routes.ts': 'features/*/*Routes.ts',
      },
    ],
    'file-named-after-export/file-named-after-export': 'error',
    'require-unicode-regexp': 'error',
    'no-nested-ternary': 'error',
    'no-implicit-coercion': 'error',
    'no-param-reassign': 'error',
    'no-console': ['error', { allow: ['error'] }],
    'typescript/method-signature-style': ['error', 'property'],
    'typescript/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
    'typescript/prefer-readonly': 'error',
    'typescript/no-deprecated': 'error',
    'typescript/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    'unicorn/no-array-for-each': 'error',
    'unicorn/prefer-string-replace-all': 'error',
    'unicorn/prefer-number-properties': 'error',
  },
  overrides: [
    { files: ['**/*.ts', '**/*.tsx'], rules: { 'export-placement/no-restricted-syntax': ['error', ...EXPORT_PLACEMENT] } },
    {
      files: ['**/*Types.ts'],
      rules: {
        'export-placement/no-restricted-syntax': [
          'error',
          { selector: 'ExportNamedDeclaration[declaration][declaration.type!=/^TS(TypeAlias|Interface)Declaration$/]', message: 'An XTypes.ts file only exports types: move this export out of it.' },
        ],
      },
    },
    {
      files: ['**/*Config.ts', '**/*Content.ts', '**/*Content.tsx'],
      rules: {
        'export-placement/no-restricted-syntax': [
          'error',
          {
            selector: 'ExportNamedDeclaration > :matches(FunctionDeclaration, ClassDeclaration, TSTypeAliasDeclaration, TSInterfaceDeclaration)',
            message: 'An XConfig.ts or XContent.ts file only exports constants: move this export out of it.',
          },
          {
            selector: 'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression).init',
            message: 'An XConfig.ts or XContent.ts file only exports constants: move this export out of it.',
          },
        ],
      },
    },
    { files: ['**/*.test.ts', '**/*.test.tsx'], rules: { 'typescript/no-floating-promises': 'off' } },
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', 'e2e/**'],
      rules: { 'export-placement/no-restricted-syntax': 'off', 'file-named-after-export/file-named-after-export': 'off' },
    },
  ],
});
