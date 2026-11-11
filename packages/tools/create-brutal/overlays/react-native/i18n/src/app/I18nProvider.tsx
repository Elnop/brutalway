import { getLocales } from 'expo-localization';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { createI18n } from '@/app/createI18n.ts';
import { saveLanguage, savedLanguage } from '@/features/language-switch/lib/languageStorage.ts';
import { pickLanguage } from '@/features/language-switch/lib/pickLanguage.ts';

const i18n = createI18n();
const deviceLanguages = getLocales().map((locale) => locale.languageCode ?? '');

void savedLanguage()
  .then(async (saved) => i18n.changeLanguage(pickLanguage(saved, deviceLanguages)))
  .then(() => i18n.on('languageChanged', saveLanguage));

type I18nProviderProps = { children: ReactNode };

export function I18nProvider({ children }: I18nProviderProps) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
