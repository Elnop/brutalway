import { axeViolations, expect, test } from '@elnop/playwright-fixtures';
import { openApp } from '@e2e/openApp.ts';

test('axe finds no violation while a task is being renamed', async ({ page }) => {
  await openApp(page);
  await page.getByRole('button', { name: 'Edit Run npm run check' }).click();
  expect(await axeViolations(page)).toStrictEqual([]);
});

test('adding, checking and filtering tasks updates the counters', async ({ page }) => {
  await openApp(page);
  await page.getByLabel('New task').fill('Ship the template');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('3 tasks left')).toBeVisible();

  await page.getByRole('checkbox', { name: 'Ship the template' }).check();
  await expect(page.getByText('2 tasks left')).toBeVisible();
  await expect(page.getByText('2 done')).toBeVisible();

  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByRole('listitem')).toHaveCount(2);
  await page.getByRole('button', { name: 'Clear done' }).click();
  await expect(page.getByText('Nothing here.')).toBeVisible();
  await expect(page.getByText('0 done')).toBeVisible();
});

test('renaming a task keeps it in the list', async ({ page }) => {
  await openApp(page);
  await page.getByRole('button', { name: 'Edit Write your first feature' }).click();
  await page.getByLabel('Rename Write your first feature').fill('Write two features');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('checkbox', { name: 'Write two features' })).toBeVisible();
});

test('the page never scrolls sideways at 320 px while a task is being renamed', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await openApp(page);
  await page.getByRole('button', { name: 'Edit Run npm run check' }).click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
});
