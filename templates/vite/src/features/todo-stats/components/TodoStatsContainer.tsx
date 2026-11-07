import { TodoStats } from '@/features/todo-stats/components/TodoStats.tsx';
import { selectCompletedCount, selectRemainingCount } from '@/shared-features/todos/todosSelectors.ts';
import { todosActions } from '@/shared-features/todos/todosStore.ts';
import { useTodos } from '@/shared-features/todos/useTodos.ts';

export function TodoStatsContainer() {
  const remaining = useTodos(selectRemainingCount);
  const completed = useTodos(selectCompletedCount);
  return <TodoStats remaining={remaining} completed={completed} onClearCompleted={todosActions.clearCompleted} />;
}
