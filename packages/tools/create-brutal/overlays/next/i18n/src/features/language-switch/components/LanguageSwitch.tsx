import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/features/language-switch/LanguagesConfig.ts';
import type { Language } from '@/features/language-switch/LanguagesTypes.ts';
import '@/features/language-switch/language-switch.css';

type LanguageSwitchProps = {
  current: string | undefined;
  onChoose: (language: Language) => void;
};

export function LanguageSwitch({ current, onChoose }: LanguageSwitchProps) {
  const { t } = useTranslation('app');
  return (
    <div className="language-switch" role="group" aria-label={t('language')}>
      {LANGUAGES.map((language) => (
        <button
          key={language}
          type="button"
          lang={language}
          className="button button-small"
          aria-pressed={current === language}
          onClick={() => onChoose(language)}
        >
          {t(`languages.${language}`)}
        </button>
      ))}
    </div>
  );
}
