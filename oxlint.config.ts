import { fastifyConfig } from '@elnop/oxlint-config-fastify';
import { nodeTestConfig } from '@elnop/oxlint-config-node-test';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [fastifyConfig, nodeTestConfig],
});
