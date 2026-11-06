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

export const nodeTestConfig: OxlintConfig = defineConfig({
  jsPlugins: [{ name: 'node-test', specifier: fileURLToPath(new URL('./plugin.js', import.meta.url)) }],
  overrides: [{ files: ['**/*.test.ts'], rules: { 'node-test/no-restricted-syntax': ['error', ...NODE_TEST_STYLE] } }],
});
