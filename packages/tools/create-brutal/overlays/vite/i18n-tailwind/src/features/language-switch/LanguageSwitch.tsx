import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/features/language-switch/LanguagesConfig.ts';

export function LanguageSwitch() {
  const { t, i18n } = useTranslation('app');

  function choose(language: (typeof LANGUAGES)[number]) {
    i18n.changeLanguage(language).catch(reportError);
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={t('language')}>
      {LANGUAGES.map((language) => (
        <button
          key={language}
          type="button"
          lang={language}
          className="button bg-paper px-[0.7rem] py-[0.3rem] text-[0.9rem] text-ink aria-pressed:bg-ink aria-pressed:text-paper"
          aria-pressed={i18n.resolvedLanguage === language}
          onClick={() => choose(language)}
        >
          {t(`languages.${language}`)}
        </button>
      ))}
    </div>
  );
}
