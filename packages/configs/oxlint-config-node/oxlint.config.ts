import { nodeTestConfig } from '@brutalway/oxlint-config-node-test';
import { defineConfig } from 'oxlint';
import { nodeConfig } from '#src/NodeConfig.ts';

export default defineConfig({ extends: [nodeConfig, nodeTestConfig] });
