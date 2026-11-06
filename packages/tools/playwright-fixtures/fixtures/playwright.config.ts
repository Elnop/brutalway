import { defineConfig } from '@playwright/test';

export default defineConfig({ testDir: '.', reporter: 'list', projects: [{ name: 'chromium' }] });
