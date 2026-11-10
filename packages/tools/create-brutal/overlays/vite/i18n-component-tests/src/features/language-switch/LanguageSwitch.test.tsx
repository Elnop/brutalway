import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { LanguageSwitch } from '@/features/language-switch/LanguageSwitch.tsx';

describe('LanguageSwitch', () => {
  it('marks the current language and switches to the one picked', async () => {
    const screen = await render(<LanguageSwitch />);
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
