import { defineConfig } from '@playwright/test';

const URL = 'http://localhost:4173/';
const onCi = Boolean(process.env['CI']);

export default defineConfig({
  testDir: 'e2e',
  tsconfig: './tsconfig.test.json',
  forbidOnly: onCi,
  reporter: onCi ? 'list' : [['list'], ['html', { open: 'never' }]],
  use: { baseURL: URL, trace: 'retain-on-failure' },
  webServer: { command: 'npx vite preview --port 4173 --strictPort', url: URL, reuseExistingServer: !onCi },
  projects: [{ name: 'chromium' }],
});
