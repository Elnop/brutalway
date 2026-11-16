import { useQuery } from '@tanstack/react-query';
import { QUERY_CACHE } from '@/features/todo-stats/QueryConfig.ts';
import { todosClient } from '@/shared/todos/todosClient.ts';
import { todosKeys } from '@/shared/todos/todosKeys.ts';

export function useTodoStatsQuery() {
  return useQuery({ queryKey: todosKeys.stats(), queryFn: todosClient.stats, ...QUERY_CACHE.live });
}
