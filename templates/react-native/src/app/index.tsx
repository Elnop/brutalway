import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { PageShell } from '@/features/page-shell/PageShell.tsx';
import { TodoListLayout } from '@/features/todo-list/components/TodoListLayout.tsx';
import { TodoStatsContainer } from '@/features/todo-stats/components/TodoStatsContainer.tsx';

export default function HomePage() {
  const { t } = useTranslation('app');
  return (
    <PageShell title={t('title')} tagline={t('tagline')}>
      <Stack.Screen options={{ title: t('title') }} />
      <TodoListLayout />
      <TodoStatsContainer />
    </PageShell>
  );
}
