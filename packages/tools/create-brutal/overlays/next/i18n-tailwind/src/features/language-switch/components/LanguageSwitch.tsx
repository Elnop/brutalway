import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/features/language-switch/LanguagesConfig.ts';
import type { Language } from '@/features/language-switch/LanguagesTypes.ts';

type LanguageSwitchProps = {
  current: string | undefined;
  onChoose: (language: Language) => void;
};

export function LanguageSwitch({ current, onChoose }: LanguageSwitchProps) {
  const { t } = useTranslation('app');
  return (
    <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={t('language')}>
      {LANGUAGES.map((language) => (
        <button
          key={language}
          type="button"
          lang={language}
          className="button bg-paper px-[0.7rem] py-[0.3rem] text-[0.9rem] text-ink aria-pressed:bg-ink aria-pressed:text-paper"
          aria-pressed={current === language}
          onClick={() => onChoose(language)}
        >
          {t(`languages.${language}`)}
        </button>
      ))}
    </div>
  );
}
