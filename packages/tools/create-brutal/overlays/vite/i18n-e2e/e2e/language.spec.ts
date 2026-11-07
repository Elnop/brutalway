import { axeViolations, expect, test } from '@brutalway/playwright-fixtures';
import { openApp } from '@e2e/openApp.ts';

test('switching to French translates the page, and the choice survives a reload', async ({ page }) => {
  await openApp(page);
  await page.getByRole('button', { name: 'Français' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tâches');
  await expect(page.getByText('2 tâches restantes')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page).toHaveTitle('Tâches');
  expect(await axeViolations(page)).toStrictEqual([]);

  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tâches');
  await expect(page.getByRole('button', { name: 'Français' })).toHaveAttribute('aria-pressed', 'true');
});
