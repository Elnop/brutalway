import { TodoStats } from '@/features/todo-stats/components/TodoStats.tsx';
import { useTodoMutations } from '@/shared-features/todos/hooks/useTodoMutations.ts';
import { useTodoStatsQuery } from '@/shared-features/todos/hooks/useTodoStatsQuery.ts';

export function TodoStatsContainer() {
  const stats = useTodoStatsQuery().data;
  const { clearCompleted } = useTodoMutations();
  return <TodoStats remaining={stats?.remaining ?? 0} completed={stats?.completed ?? 0} onClearCompleted={() => clearCompleted()} />;
}
