import type { i18n } from 'i18next';
import { LANGUAGES } from '@/features/language-switch/LanguagesConfig.ts';

const STORAGE_KEY = 'language';

function isLanguage(value: string | null | undefined): value is (typeof LANGUAGES)[number] {
  return LANGUAGES.some((language) => language === value);
}

export function preferredLanguage(): (typeof LANGUAGES)[number] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (isLanguage(saved)) return saved;
  return navigator.languages.map((tag) => tag.split('-')[0]).find(isLanguage) ?? LANGUAGES[0];
}

export function followLanguage(instance: i18n): void {
  function showLanguage() {
    document.documentElement.lang = instance.resolvedLanguage ?? LANGUAGES[0];
    document.title = instance.t('title', { ns: 'app' });
  }
  showLanguage();
  instance.on('languageChanged', (language) => {
    localStorage.setItem(STORAGE_KEY, language);
    showLanguage();
  });
}
