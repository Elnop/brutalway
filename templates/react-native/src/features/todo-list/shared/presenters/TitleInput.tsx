import { StyleSheet, TextInput } from 'react-native';
import type { TextInputProps } from 'react-native';
import { THEME } from '@/shared/theme/ThemeConfig.ts';

type TitleInputProps = TextInputProps & {
  label: string;
  error: string | undefined;
};

export function TitleInput({ label, error, ...input }: TitleInputProps) {
  return (
    <TextInput
      aria-label={label}
      accessibilityHint={error}
      placeholderTextColor={THEME.colors.ink}
      returnKeyType="done"
      submitBehavior="submit"
      style={styles.input}
      {...input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    ...THEME.border,
    flexGrow: 1,
    flexBasis: THEME.sizes.field,
    minWidth: 0,
    paddingVertical: THEME.spacing.s,
    paddingHorizontal: THEME.spacing.m,
    backgroundColor: THEME.colors.paper,
    color: THEME.colors.ink,
    fontFamily: THEME.fonts.regular,
    fontSize: THEME.fontSizes.body,
  },
});
