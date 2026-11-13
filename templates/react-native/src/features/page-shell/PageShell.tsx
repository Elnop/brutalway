import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '@/shared-features/theme/ThemeConfig.ts';

type PageShellProps = {
  title: string;
  tagline: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export function PageShell({ title, tagline, actions, children }: PageShellProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <Text role="heading" style={styles.title}>
            {title}
          </Text>
          <Text style={styles.tagline}>{tagline}</Text>
          {actions}
        </View>
        <View role="main" style={styles.body}>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: THEME.colors.page },
  page: {
    width: '100%',
    maxWidth: THEME.pageWidth,
    marginHorizontal: 'auto',
    paddingVertical: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.l,
  },
  header: { alignItems: 'flex-start', marginBottom: THEME.spacing.xl },
  title: {
    color: THEME.colors.ink,
    fontFamily: THEME.fonts.bold,
    fontSize: THEME.fontSizes.title,
    textTransform: 'uppercase',
  },
  tagline: {
    ...THEME.border,
    marginTop: THEME.spacing.m,
    paddingVertical: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.s,
    backgroundColor: THEME.colors.pink,
    color: THEME.colors.onAccent,
    fontFamily: THEME.fonts.bold,
    fontSize: THEME.fontSizes.body,
    transform: [{ rotate: '-2deg' }],
  },
  body: { gap: THEME.spacing.xl },
});
