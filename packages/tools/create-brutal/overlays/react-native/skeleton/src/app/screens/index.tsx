import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { PageShell } from '@/features/page-shell/PageShell.tsx';

export default function HomePage() {
  const { t } = useTranslation('app');
  return (
    <PageShell title={t('title')} tagline={t('start')}>
      <Stack.Screen options={{ title: t('title') }} />
    </PageShell>
  );
}
