import { nodeConfig } from '@brutalway/oxlint-config-node';
import { nodeTestConfig } from '@brutalway/oxlint-config-node-test';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [nodeConfig, nodeTestConfig],
  overrides: [{ files: ['src/playwrightFixtures.ts'], rules: { 'export-placement/no-restricted-syntax': 'off' } }],
});
