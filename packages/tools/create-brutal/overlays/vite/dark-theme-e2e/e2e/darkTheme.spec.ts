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
