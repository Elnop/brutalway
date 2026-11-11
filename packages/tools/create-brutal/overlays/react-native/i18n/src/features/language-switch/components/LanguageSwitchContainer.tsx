import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from '@/features/language-switch/components/LanguageSwitch.tsx';
import type { Language } from '@/features/language-switch/LanguagesTypes.ts';

export function LanguageSwitchContainer() {
  const { i18n } = useTranslation();

  function choose(language: Language) {
    void i18n.changeLanguage(language);
  }

  return <LanguageSwitch current={i18n.resolvedLanguage} onChoose={choose} />;
}
