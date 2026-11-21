import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { THEME } from '@/shared/ThemeConfig.ts';

type ThemedCardProps = { theme: typeof THEME };

export function ThemedCard({ theme }: ThemedCardProps) {
  const styles = useMemo(() => createStyles(theme), [theme]);
  return <View style={styles.card} />;
}

function createStyles(theme: typeof THEME) {
  const styles = StyleSheet.create({
    card: { padding: theme.spacing.m, backgroundColor: theme.colors.paper },
    unused: { flex: 1 },
  });
  return styles;
}
