import { AxeBuilder } from '@axe-core/playwright';
import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export const test = base.extend<{ pageErrors: string[] }>({
  pageErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await use(errors);
      expect(errors).toStrictEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export async function openApp(page: Page): Promise<void> {
  await page.goto('./');
  await page.getByRole('heading', { name: 'Floor plan' }).waitFor();
}

export async function axeViolations(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`);
}
