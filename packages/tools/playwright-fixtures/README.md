# @brutalway/playwright-fixtures

Two things every e2e suite of ours needs: a Playwright `test` that fails on page errors and Content Security Policy violations, and an axe-core helper.

## Install

```sh
npm install --save-dev @brutalway/playwright-fixtures @playwright/test @axe-core/playwright
```

Import `test` and `expect` from the package instead of `@playwright/test`:

```ts
import { expect, test } from '@brutalway/playwright-fixtures';
```

## Usage

### Check a page with axe

```ts
import { axeViolations, expect, test } from '@brutalway/playwright-fixtures';

test('the home page has no axe violation', async ({ page }) => {
  await page.goto('/');
  expect(await axeViolations(page)).toStrictEqual([]);
});
```

### Add your own helpers

Import `test` and `expect` from here in your `e2e/fixtures.ts` and extend them there.

## Reference

- `test`: Playwright's `test` with two automatic fixtures, which fail the test if the page threw a JavaScript error while it ran, or if the browser reported a violation of the page's Content Security Policy
- `axeViolations(page)`: runs axe-core on the page and returns one line per violated rule, with the selectors of the nodes, so a failing assertion says what to fix
