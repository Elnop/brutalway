import { LANGUAGES } from '@/features/language-switch/LanguagesConfig.ts';
import type { Language } from '@/features/language-switch/LanguagesTypes.ts';

function isLanguage(value: string | undefined): value is Language {
  return LANGUAGES.some((language) => language === value);
}

export function pickLanguage(saved: string | undefined, acceptLanguage: string): Language {
  if (isLanguage(saved)) return saved;
  const tags = acceptLanguage.split(',').map((tag) => tag.split(/[-;]/u)[0]?.trim());
  return tags.find(isLanguage) ?? LANGUAGES[0];
}
