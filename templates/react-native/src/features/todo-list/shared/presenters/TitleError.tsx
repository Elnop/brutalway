import { StyleSheet, Text } from 'react-native';
import { THEME } from '@/shared/ThemeConfig.ts';

type TitleErrorProps = {
  error: string | undefined;
};

export function TitleError({ error }: TitleErrorProps) {
  if (error === undefined) return null;
  return (
    <Text role="alert" accessibilityLiveRegion="assertive" style={styles.error}>
      {error}
    </Text>
  );
}

const styles = StyleSheet.create({
  error: {
    ...THEME.border,
    flexBasis: '100%',
    paddingVertical: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.s,
    backgroundColor: THEME.colors.pink,
    color: THEME.colors.onAccent,
    fontFamily: THEME.fonts.bold,
    fontSize: THEME.fontSizes.body,
  },
});
