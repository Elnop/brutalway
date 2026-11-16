import { TodoStats } from '@/features/todo-stats/components/TodoStats.tsx';
import { useTodoMutations } from '@/shared/todos/useTodoMutations.ts';
import { useTodoStatsQuery } from '@/features/todo-stats/useTodoStatsQuery.ts';

export function TodoStatsContainer() {
  const stats = useTodoStatsQuery().data;
  const { clearCompleted } = useTodoMutations();
  return (
    <TodoStats
      remaining={stats?.remaining ?? 0}
      completed={stats?.completed ?? 0}
      onClearCompleted={() => clearCompleted()}
    />
  );
}
