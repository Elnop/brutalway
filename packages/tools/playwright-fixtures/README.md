# @brutalway/playwright-fixtures

Two things every e2e suite of ours needs:

- `test`: Playwright's `test` with an automatic fixture that fails the test if the page threw a JavaScript error while it ran
- `axeViolations(page)`: runs axe-core on the page and returns one line per violated rule, with the selectors of the nodes, so a failing assertion says what to fix

```sh
npm install --save-dev @brutalway/playwright-fixtures @playwright/test @axe-core/playwright
```

```ts
import { axeViolations, expect, test } from '@brutalway/playwright-fixtures';

test('the home page has no axe violation', async ({ page }) => {
  await page.goto('/');
  expect(await axeViolations(page)).toStrictEqual([]);
});
```

To add your own helpers, import `test` and `expect` from here in your `e2e/fixtures.ts` and extend them there.
