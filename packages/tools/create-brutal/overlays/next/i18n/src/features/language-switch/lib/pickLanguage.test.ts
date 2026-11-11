import { describe, expect, it } from 'vitest';
import { pickLanguage } from '@/features/language-switch/lib/pickLanguage.ts';

describe('pickLanguage', () => {
  it('keeps the saved language when the project has it', () => {
    expect(pickLanguage('fr', 'en-US,en;q=0.9')).toBe('fr');
  });

  it('takes the first language of the browser the project has', () => {
    expect(pickLanguage('de', 'de-DE,fr-FR;q=0.8,en;q=0.5')).toBe('fr');
  });

  it('falls back to the first language of the project', () => {
    expect(pickLanguage(undefined, '')).toBe('en');
  });
});
