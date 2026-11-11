import { Pressable, StyleSheet, Text } from 'react-native';
import type { PressableProps } from 'react-native';
import { THEME } from '@/shared/ThemeConfig.ts';
import type { Tone } from '@/shared/ThemeTypes.ts';

type ButtonProps = PressableProps & {
  label: string;
  tone?: Tone;
  small?: boolean;
};

export function Button({ label, tone = 'paper', small = false, ...pressable }: ButtonProps) {
  const selected = pressable['aria-selected'] === true;
  return (
    <Pressable
      role="button"
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: selected ? THEME.colors.ink : THEME.colors[tone] },
        small && styles.small,
        pressed && styles.pressed,
        pressable.disabled === true && styles.disabled,
      ]}
      {...pressable}
    >
      <Text style={[styles.label, small && styles.smallLabel, selected && styles.selectedLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    ...THEME.border,
    paddingVertical: THEME.spacing.s,
    paddingHorizontal: THEME.spacing.l,
    boxShadow: THEME.shadows.small,
  },
  small: { paddingVertical: THEME.spacing.xs, paddingHorizontal: THEME.spacing.m },
  pressed: {
    transform: [{ translateX: THEME.pressedOffset }, { translateY: THEME.pressedOffset }],
    boxShadow: 'none',
  },
  disabled: { opacity: 0.45, boxShadow: 'none' },
  label: {
    color: THEME.colors.ink,
    fontFamily: THEME.fonts.bold,
    fontSize: THEME.fontSizes.body,
  },
  smallLabel: { fontSize: THEME.fontSizes.small },
  selectedLabel: { color: THEME.colors.paper },
});
