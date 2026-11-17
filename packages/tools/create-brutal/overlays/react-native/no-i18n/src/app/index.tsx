import { Stack } from 'expo-router';
import { PageShell } from '@/features/page-shell/PageShell.tsx';
import { TodoListLayout } from '@/features/todo-list/components/TodoListLayout.tsx';
import { TodoStatsContainer } from '@/features/todo-stats/components/TodoStatsContainer.tsx';

export default function HomePage() {
  return (
    <PageShell title="Todos" tagline="template-react-native · brutalway">
      <Stack.Screen options={{ title: 'Todos' }} />
      <TodoListLayout />
      <TodoStatsContainer />
    </PageShell>
  );
}
