import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { LanguageSwitchContainer } from '@/features/language-switch/LanguageSwitchContainer.tsx';

describe('LanguageSwitchContainer', () => {
  it('marks the current language and switches to the one picked', async () => {
    const screen = await render(<LanguageSwitchContainer />);
    await expect
      .element(screen.getByRole('button', { name: 'English' }))
      .toHaveAttribute('aria-pressed', 'true');
    await screen.getByRole('button', { name: 'Français' }).click();
    await expect
      .element(screen.getByRole('button', { name: 'Français' }))
      .toHaveAttribute('aria-pressed', 'true');
    await expect.element(screen.getByRole('group', { name: 'Langue' })).toBeVisible();
  });
});
