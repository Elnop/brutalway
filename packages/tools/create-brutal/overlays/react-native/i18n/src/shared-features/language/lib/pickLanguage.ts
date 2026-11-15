import { LANGUAGES } from '@/shared-features/language/LanguagesConfig.ts';
import type { Language } from '@/shared-features/language/LanguagesTypes.ts';

function isLanguage(value: string | null | undefined): value is Language {
  return LANGUAGES.some((language) => language === value);
}

export function pickLanguage(saved: string | null, deviceLanguages: string[]): Language {
  if (isLanguage(saved)) return saved;
  return deviceLanguages.find(isLanguage) ?? LANGUAGES[0];
}
