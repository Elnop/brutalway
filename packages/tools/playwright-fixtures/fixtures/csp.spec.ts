import { test } from '#src/playwrightFixtures.ts';

test('a page that breaks its CSP', async ({ page }) => {
  await page.setContent(`<meta http-equiv="Content-Security-Policy" content="script-src 'none'"><script>document.title = 'ran';</script>`);
});
