import { fastifyConfig } from '@brutalway/oxlint-config-fastify';
import { nodeTestConfig } from '@brutalway/oxlint-config-node-test';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [fastifyConfig, nodeTestConfig],
});
