import { Button } from '@third-party/shadcn/button';
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
        <Button
          key={language}
          type="button"
          variant="secondary"
          size="sm"
          lang={language}
          className="aria-pressed:bg-ink aria-pressed:text-paper"
          aria-pressed={i18n.resolvedLanguage === language}
          onClick={() => choose(language)}
        >
          {t(`languages.${language}`)}
        </Button>
      ))}
    </div>
  );
}
