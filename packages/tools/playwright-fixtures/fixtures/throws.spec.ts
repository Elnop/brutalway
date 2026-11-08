import { test } from '#src/playwrightFixtures.ts';

test('a page that throws', async ({ page }) => {
  await page.setContent('<script>throw new Error("boom")</script>');
});
