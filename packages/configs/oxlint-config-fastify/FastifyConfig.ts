import { nodeConfig } from '@brutalway/oxlint-config-node';
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
  extends: [nodeConfig],
  jsPlugins: [{ name: 'fastify-conventions', specifier: fileURLToPath(new URL('./plugin.js', import.meta.url)) }],
  rules: {
    'oxc/no-async-endpoint-handlers': 'off',
  },
  overrides: [
    { files: ['**/*.ts'], rules: { 'fastify-conventions/no-restricted-syntax': ['error', PROCESS_ENV, ...SERVER_CONVENTIONS] } },
    { files: ['**/*Env.ts'], rules: { 'fastify-conventions/no-restricted-syntax': ['error', ...SERVER_CONVENTIONS] } },
    { files: ['**/*Service.ts', '**/*Queries.ts', '**/*Schemas.ts', '**/*Routes.ts', '**/*Worker.ts'], rules: { 'file-named-after-export/file-named-after-export': 'off' } },
    { files: ['*.config.ts'], rules: { 'fastify-conventions/no-restricted-syntax': 'off' } },
  ],
});
