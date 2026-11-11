import { describe, expect, it } from '@jest/globals';
import { pickLanguage } from '@/features/language-switch/lib/pickLanguage.ts';

describe('pickLanguage', () => {
  it('keeps the saved language first', () => {
    expect(pickLanguage('fr', ['en'])).toBe('fr');
  });

  it('takes the first language of the device the app has, or English', () => {
    expect(pickLanguage(null, ['de', 'fr', 'en'])).toBe('fr');
    expect(pickLanguage('es', ['de'])).toBe('en');
  });
});
