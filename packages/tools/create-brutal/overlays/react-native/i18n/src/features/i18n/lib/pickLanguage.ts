import { LANGUAGES } from '@/shared/language/LanguagesConfig.ts';
import type { Language } from '@/shared/language/LanguagesTypes.ts';

function isLanguage(value: string | null | undefined): value is Language {
  return LANGUAGES.some((language) => language === value);
}

export function pickLanguage(saved: string | null, deviceLanguages: string[]): Language {
  if (isLanguage(saved)) return saved;
  return deviceLanguages.find(isLanguage) ?? LANGUAGES[0];
}
