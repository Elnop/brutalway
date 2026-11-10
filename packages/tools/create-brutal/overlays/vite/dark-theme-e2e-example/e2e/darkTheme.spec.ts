import { axeViolations, expect, test } from '@brutalway/playwright-fixtures';
import { openApp } from '@e2e/openApp.ts';

test.use({ colorScheme: 'dark' });

test('the page turns dark when the system is dark, and axe finds no violation', async ({
  page,
}) => {
  await openApp(page);
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
    'rgb(18, 17, 15)',
  );
  expect(await axeViolations(page)).toStrictEqual([]);
});

test('axe finds no violation in dark mode on a task being renamed and on an error', async ({
  page,
}) => {
  await openApp(page);
  await page.getByRole('button', { name: 'Edit Run npm run check' }).click();
  await page.getByLabel('New task').fill('   ');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByRole('alert')).toHaveText('The title is blank');
  expect(await axeViolations(page)).toStrictEqual([]);
});
