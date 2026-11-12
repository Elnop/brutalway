import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/shared-features/theme/Button.tsx';
import { THEME } from '@/shared-features/theme/ThemeConfig.ts';

type TodoStatsProps = {
  remaining: number;
  completed: number;
  onClearCompleted: () => void;
};

export function TodoStats({ remaining, completed, onClearCompleted }: TodoStatsProps) {
  const { t } = useTranslation('todoStats');
  return (
    <View role="region" aria-label={t('title')} style={styles.stats}>
      <Text accessibilityLiveRegion="polite" style={[styles.chip, styles.left]}>
        {t('left', { count: remaining })}
      </Text>
      <Text style={styles.chip}>{t('done', { count: completed })}</Text>
      <View style={styles.clear}>
        <Button
          label={t('clear')}
          tone="pink"
          disabled={completed === 0}
          onPress={onClearCompleted}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.m,
    alignItems: 'center',
  },
  chip: {
    ...THEME.border,
    paddingVertical: THEME.spacing.s,
    paddingHorizontal: THEME.spacing.m,
    backgroundColor: THEME.colors.paper,
    boxShadow: THEME.shadows.small,
    color: THEME.colors.ink,
    fontFamily: THEME.fonts.bold,
    fontSize: THEME.fontSizes.body,
  },
  left: { backgroundColor: THEME.colors.blue, color: THEME.colors.onAccent },
  clear: { marginLeft: 'auto' },
});
