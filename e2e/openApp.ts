import type { Page } from '@playwright/test';

export async function openApp(page: Page): Promise<void> {
  await page.goto('./');
  await page.getByRole('heading', { name: 'Floor plan' }).waitFor();
}
