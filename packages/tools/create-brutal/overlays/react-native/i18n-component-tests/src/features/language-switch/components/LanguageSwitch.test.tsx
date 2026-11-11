import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, userEvent } from '@testing-library/react-native';
import { LanguageSwitch } from '@/features/language-switch/components/LanguageSwitch.tsx';
import type { Language } from '@/features/language-switch/LanguagesTypes.ts';

describe('LanguageSwitch', () => {
  it('marks the current language and sends the one picked', async () => {
    const onChoose = jest.fn<(language: Language) => void>();
    await render(<LanguageSwitch current="en" onChoose={onChoose} />);
    expect(screen.getByRole('button', { name: 'English' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Français' })).not.toBeSelected();
    await userEvent.setup().press(screen.getByRole('button', { name: 'Français' }));
    expect(onChoose).toHaveBeenCalledWith('fr');
    expect(screen.getByLabelText('Language')).toBeOnTheScreen();
  });
});
