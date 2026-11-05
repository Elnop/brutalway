import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      passWithNoTests: true,
      projects: [
        { extends: true, test: { name: 'unit', environment: 'node', include: ['src/**/*.test.ts'] } },
        {
          extends: true,
          test: {
            name: 'component',
            include: ['src/**/*.test.tsx'],
            browser: { enabled: true, provider: playwright(), headless: true, instances: [{ browser: 'chromium' }] },
          },
        },
      ],
    },
  }),
);
