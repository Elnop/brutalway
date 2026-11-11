import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TodoListLayout } from '@/features/todo-list/components/TodoListLayout.tsx';
import { TodoStatsContainer } from '@/features/todo-stats/components/TodoStatsContainer.tsx';
import { THEME } from '@/shared/theme/ThemeConfig.ts';

export default function HomePage() {
  const { t } = useTranslation('app');
  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ title: t('title') }} />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <Text role="heading" style={styles.title}>
            {t('title')}
          </Text>
          <Text style={styles.tagline}>{t('tagline')}</Text>
        </View>
        <View role="main" style={styles.body}>
          <TodoListLayout />
          <TodoStatsContainer />
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
