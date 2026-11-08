import { nodeConfig } from '@brutalway/oxlint-config-node';
import { defineConfig } from 'oxlint';
import { nodeTestConfig } from '#src/NodeTestConfig.ts';

export default defineConfig({ extends: [nodeConfig, nodeTestConfig] });
