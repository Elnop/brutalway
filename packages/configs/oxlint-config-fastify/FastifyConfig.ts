import { typescriptConfig } from '@brutal/oxlint-config-typescript';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

const PROCESS_ENV = {
  selector: "MemberExpression[object.name='process'][property.name='env']",
  message: 'Read process.env only in an xEnv.ts file, which validates it with Zod: pass the parsed values to the code that needs them.',
};

const SERVER_CONVENTIONS = [
  {
    selector: 'CallExpression[callee.property.name=/^decorate(Request|Reply)?$/]',
    message: 'Pass dependencies as factory parameters (createXService({ ... })) wired in src/app/, not through decorate.',
  },
  {
    selector: ":matches(ArrowFunctionExpression, FunctionExpression, FunctionDeclaration)[async=true] CallExpression[callee.object.name='reply'][callee.property.name='send']",
    message: 'An async handler returns its value: return it instead of calling reply.send().',
  },
];

export const fastifyConfig: OxlintConfig = defineConfig({
  extends: [typescriptConfig],
  plugins: ['typescript', 'import', 'oxc', 'unicorn', 'node'],
  jsPlugins: [{ name: 'fastify-conventions', specifier: fileURLToPath(new URL('./plugin.js', import.meta.url)) }],
  env: { node: true, es2024: true },
  rules: {
    'oxc/no-async-endpoint-handlers': 'off',
    'no-restricted-globals': ['error', { name: 'fetch', message: 'Only an xClient.ts file calls fetch: move this call into the client of the API it targets.' }],
    'no-restricted-imports': ['error', { patterns: [{ regex: '^\\.\\.?/', message: 'Relative imports are not allowed: import through the #src/ alias declared in package.json "imports".' }] }],
  },
  overrides: [
    { files: ['**/*.ts'], rules: { 'fastify-conventions/no-restricted-syntax': ['error', PROCESS_ENV, ...SERVER_CONVENTIONS] } },
    { files: ['**/*Env.ts'], rules: { 'fastify-conventions/no-restricted-syntax': ['error', ...SERVER_CONVENTIONS] } },
    {
      files: ['**/*Schemas.ts'],
      rules: {
        'export-placement/no-restricted-syntax': [
          'error',
          {
            selector: 'ExportNamedDeclaration > :matches(FunctionDeclaration, ClassDeclaration, TSTypeAliasDeclaration, TSInterfaceDeclaration, TSEnumDeclaration)',
            message: 'An XSchemas.ts file only exports Zod schemas: move this export out of it, and infer types in an XTypes.ts file.',
          },
        ],
      },
    },
    { files: ['**/*Service.ts', '**/*Queries.ts', '**/*Schemas.ts', '**/*Routes.ts', '**/*Client.ts', '**/*Worker.ts'], rules: { 'file-named-after-export/file-named-after-export': 'off' } },
    { files: ['**/*Client.ts', '**/*.test.ts'], rules: { 'no-restricted-globals': 'off' } },
    { files: ['*.config.ts'], rules: { 'fastify-conventions/no-restricted-syntax': 'off' } },
  ],
});
