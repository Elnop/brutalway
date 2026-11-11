import { Button } from '@third-party/shadcn/button';
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
        <Button
          key={language}
          type="button"
          variant="secondary"
          size="sm"
          lang={language}
          className="aria-pressed:bg-ink aria-pressed:text-paper"
          aria-pressed={current === language}
          onClick={() => onChoose(language)}
        >
          {t(`languages.${language}`)}
        </Button>
      ))}
    </div>
  );
}
