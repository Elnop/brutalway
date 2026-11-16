import { Pressable, StyleSheet, Text } from 'react-native';
import type { PressableProps } from 'react-native';
import { THEME } from '@/shared/theme/ThemeConfig.ts';
import type { Tone } from '@/shared/theme/ThemeTypes.ts';

type ButtonProps = PressableProps & {
  label: string;
  tone?: Tone;
  small?: boolean;
};

function toneStyle(tone: Tone) {
  return { paper: styles.paper, yellow: styles.yellow, pink: styles.pink, blue: styles.blue }[tone];
}

export function Button({ label, tone = 'paper', small = false, ...pressable }: ButtonProps) {
  const selected = pressable['aria-selected'] === true;
  return (
    <Pressable
      role="button"
      style={({ pressed }) => [
        styles.button,
        selected ? styles.selected : toneStyle(tone),
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
  paper: { backgroundColor: THEME.colors.paper },
  yellow: { backgroundColor: THEME.colors.yellow },
  pink: { backgroundColor: THEME.colors.pink },
  blue: { backgroundColor: THEME.colors.blue },
  selected: { backgroundColor: THEME.colors.ink },
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
