import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { LanguageSwitch } from '@/features/language-switch/components/LanguageSwitch.tsx';
import type { Language } from '@/features/language-switch/LanguagesTypes.ts';

describe('LanguageSwitch', () => {
  it('marks the current language and hands over the one picked', async () => {
    const onChoose = vi.fn<(language: Language) => void>();
    const screen = await render(<LanguageSwitch current="en" onChoose={onChoose} />);
    await expect
      .element(screen.getByRole('button', { name: 'English' }))
      .toHaveAttribute('aria-pressed', 'true');
    await expect
      .element(screen.getByRole('button', { name: 'Français' }))
      .toHaveAttribute('aria-pressed', 'false');
    await screen.getByRole('button', { name: 'Français' }).click();
    expect(onChoose).toHaveBeenCalledExactlyOnceWith('fr');
  });
});
