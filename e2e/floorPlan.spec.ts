import { axeViolations, expect, test } from '@elnop/playwright-fixtures';
import { openApp } from '@e2e/openApp.ts';

test('axe finds no violation, with and without a selected room', async ({ page }) => {
  await openApp(page);
  expect(await axeViolations(page)).toStrictEqual([]);
  await page
    .getByRole('button', { name: /Kitchen/u })
    .first()
    .click();
  expect(await axeViolations(page)).toStrictEqual([]);
});

test('adding a room updates the list, the plan and the total', async ({ page }) => {
  await openApp(page);
  const form = page.getByRole('form', { name: 'New room' });
  await form.getByLabel('Name').fill('Office');
  await form.getByLabel('Width (m)').fill('2.5');
  await form.getByLabel('Length (m)').fill('3');
  await form.getByRole('button', { name: 'Add room' }).click();

  await expect(page.getByRole('group', { name: 'Floor plan drawing' }).getByRole('button', { name: /Office/u })).toBeVisible();
  await expect(page.getByRole('table').locator('tfoot')).toContainText('49.20 m²');
});

test('clicking a room on the plan selects it in the list and opens its editor', async ({ page }) => {
  await openApp(page);
  await page
    .getByRole('group', { name: 'Floor plan drawing' })
    .getByRole('button', { name: /Bedroom/u })
    .click();
  await expect(page.getByRole('list').getByRole('button', { name: /Bedroom/u })).toHaveAttribute('aria-pressed', 'true');

  const editor = page.getByRole('form', { name: 'Edit Bedroom' });
  await editor.getByLabel('Width (m)').fill('4');
  await editor.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('table').locator('tfoot')).toContainText('43.30 m²');
});

test('the page never scrolls sideways on a 320 px screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await openApp(page);
  await page
    .getByRole('group', { name: 'Floor plan drawing' })
    .getByRole('button', { name: /Kitchen/u })
    .click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBe(0);
});
