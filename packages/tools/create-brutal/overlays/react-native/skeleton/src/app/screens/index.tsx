import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
        </View>
        <View role="main">
          <Text style={styles.start}>{t('start')}</Text>
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
  start: {
    color: THEME.colors.ink,
    fontFamily: THEME.fonts.regular,
    fontSize: THEME.fontSizes.body,
  },
});
