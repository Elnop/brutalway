import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/features/language-switch/LanguagesConfig.ts';
import '@/features/language-switch/language-switch.css';

export function LanguageSwitch() {
  const { t, i18n } = useTranslation('app');

  function choose(language: (typeof LANGUAGES)[number]) {
    i18n.changeLanguage(language).catch(reportError);
  }

  return (
    <div className="language-switch" role="group" aria-label={t('language')}>
      {LANGUAGES.map((language) => (
        <button
          key={language}
          type="button"
          lang={language}
          className="button button-small"
          aria-pressed={i18n.resolvedLanguage === language}
          onClick={() => choose(language)}
        >
          {t(`languages.${language}`)}
        </button>
      ))}
    </div>
  );
}
