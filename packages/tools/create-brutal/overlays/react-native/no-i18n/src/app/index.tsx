import { Stack } from 'expo-router';
import { PageLayout } from '@/features/page-layout/PageLayout.tsx';
import { TodoListLayout } from '@/features/todo-list/components/TodoListLayout.tsx';
import { TodoStatsContainer } from '@/features/todo-stats/components/TodoStatsContainer.tsx';

export default function HomePage() {
  return (
    <PageLayout title="Todos" tagline="template-react-native · brutalway">
      <Stack.Screen options={{ title: 'Todos' }} />
      <TodoListLayout />
      <TodoStatsContainer />
    </PageLayout>
  );
}
