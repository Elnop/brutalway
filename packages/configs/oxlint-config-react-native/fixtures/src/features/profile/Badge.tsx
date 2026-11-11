import { StyleSheet, Text, View } from 'react-native';
import { THEME } from '@/shared/ThemeConfig.ts';

type BadgeProps = { label: string; done: boolean };

export function Badge({ label, done }: BadgeProps) {
  return (
    <View style={[styles.badge, done && styles.done]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: THEME.sizes.badge,
    margin: 0,
    maxWidth: '100%',
    flex: 1,
    opacity: 0.5,
    padding: THEME.spacing.s,
    borderColor: 'transparent',
    backgroundColor: THEME.colors.paper,
    boxShadow: THEME.shadow,
  },
  done: { boxShadow: 'none' },
  label: { color: THEME.colors.ink, fontFamily: THEME.fonts.bold },
});
