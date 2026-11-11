import { LANGUAGES } from '@/features/language-switch/LanguagesConfig.ts';
import type { Language } from '@/features/language-switch/LanguagesTypes.ts';

function isLanguage(value: string | null | undefined): value is Language {
  return LANGUAGES.some((language) => language === value);
}

export function pickLanguage(saved: string | null, deviceLanguages: string[]): Language {
  if (isLanguage(saved)) return saved;
  return deviceLanguages.find(isLanguage) ?? LANGUAGES[0];
}
