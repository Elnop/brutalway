import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'oxlint';
import type { OxlintConfig } from 'oxlint';

const NODE_TEST_STYLE = [
  {
    selector: "ImportDeclaration[source.value='node:test'] > ImportSpecifier[imported.name='test']",
    message: 'Write each case as it() inside a describe(), both imported from node:test.',
  },
  {
    selector: "ImportDeclaration[source.value='node:assert']",
    message: 'Import node:assert/strict: its equal and deepEqual compare strictly.',
  },
  {
    selector: "Program > ExpressionStatement > CallExpression[callee.name='it']",
    message: 'An it() goes inside a describe() named after what it tests.',
  },
];

function siblingModule(name: string) {
  return fileURLToPath(new URL(`./${name}${extname(import.meta.url)}`, import.meta.url));
}

export const nodeTestConfig: OxlintConfig = defineConfig({
  jsPlugins: [{ name: 'node-test', specifier: siblingModule('plugin') }],
  overrides: [{ files: ['**/*.test.ts'], rules: { 'node-test/no-restricted-syntax': ['error', ...NODE_TEST_STYLE] } }],
});
