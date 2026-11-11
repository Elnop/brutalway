'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from '@/features/language-switch/components/LanguageSwitch.tsx';
import { LANGUAGE_COOKIE } from '@/features/language-switch/LanguagesConfig.ts';
import type { Language } from '@/features/language-switch/LanguagesTypes.ts';

const ONE_YEAR = 60 * 60 * 24 * 365;

export function LanguageSwitchContainer() {
  const { i18n } = useTranslation('app');
  const router = useRouter();

  function choose(language: Language) {
    document.cookie = [
      `${LANGUAGE_COOKIE}=${language}`,
      'path=/',
      `max-age=${ONE_YEAR}`,
      'samesite=lax',
    ].join('; ');
    i18n
      .changeLanguage(language)
      .then(() => router.refresh())
      .catch(reportError);
  }

  return <LanguageSwitch current={i18n.resolvedLanguage} onChoose={choose} />;
}
