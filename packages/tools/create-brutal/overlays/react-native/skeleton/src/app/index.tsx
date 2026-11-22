import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/features/page-layout/PageLayout.tsx';

export default function HomePage() {
  const { t } = useTranslation('app');
  return (
    <PageLayout title={t('title')} tagline={t('start')}>
      <Stack.Screen options={{ title: t('title') }} />
    </PageLayout>
  );
}
