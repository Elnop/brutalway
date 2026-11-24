import { axeViolations, expect, test } from '@brutalway/playwright-fixtures';
import { openApp } from '@e2e/openApp.ts';

test('axe finds no violation on the first screen', async ({ page }) => {
  await openApp(page);
  expect(await axeViolations(page)).toStrictEqual([]);
});

test('the first screen never scrolls sideways at 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await openApp(page);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});
