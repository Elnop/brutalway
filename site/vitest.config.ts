import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      passWithNoTests: true,
      projects: [{ extends: true, test: { name: 'unit', environment: 'node', include: ['src/**/*.test.ts'] } }],
    },
  }),
);
