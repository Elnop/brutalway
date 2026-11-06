import { axeViolations, expect, test } from '../playwrightFixtures.ts';

test('axe lists the violations of a page', async ({ page }) => {
  await page.setContent('<!doctype html><html lang="en"><head><title>Fixture</title></head><body><main><img src="data:," id="logo"></main></body></html>');
  expect(await axeViolations(page)).toContain('image-alt: #logo');
});

test('axe finds nothing on a clean page', async ({ page }) => {
  await page.setContent('<!doctype html><html lang="en"><head><title>Fixture</title></head><body><main><h1>Clean</h1></main></body></html>');
  expect(await axeViolations(page)).toStrictEqual([]);
});
