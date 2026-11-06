import { fastifyConfig } from '@brutal/oxlint-config-fastify';
import { nodeTestConfig } from '@brutal/oxlint-config-node-test';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [fastifyConfig, nodeTestConfig],
});
