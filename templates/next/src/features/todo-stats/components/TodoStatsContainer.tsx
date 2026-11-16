'use client';

import { TodoStats } from '@/features/todo-stats/components/TodoStats.tsx';
import { selectCompletedCount, selectRemainingCount } from '@/shared/todos/lib/todosSelectors.ts';
import { todosActions } from '@/shared/todos/todosStore.ts';
import { useTodos } from '@/shared/todos/useTodos.ts';

export function TodoStatsContainer() {
  const remaining = useTodos(selectRemainingCount);
  const completed = useTodos(selectCompletedCount);
  return (
    <TodoStats
      remaining={remaining}
      completed={completed}
      onClearCompleted={todosActions.clearCompleted}
    />
  );
}
