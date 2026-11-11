import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { LANGUAGES } from '@/features/language-switch/LanguagesConfig.ts';
import type { Language } from '@/features/language-switch/LanguagesTypes.ts';
import { Button } from '@/shared/theme/Button.tsx';
import { THEME } from '@/shared/theme/ThemeConfig.ts';

type LanguageSwitchProps = {
  current: string | undefined;
  onChoose: (language: Language) => void;
};

export function LanguageSwitch({ current, onChoose }: LanguageSwitchProps) {
  const { t } = useTranslation('app');
  return (
    <View role="group" aria-label={t('language')} style={styles.switch}>
      {LANGUAGES.map((language) => (
        <Button
          key={language}
          label={t(`languages.${language}`)}
          small
          aria-selected={current === language}
          onPress={() => onChoose(language)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  switch: { flexDirection: 'row', gap: THEME.spacing.s, marginTop: THEME.spacing.m },
});
