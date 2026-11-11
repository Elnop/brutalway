import { useQuery } from '@tanstack/react-query';
import { QUERY_CACHE } from '@/shared/QueryConfig.ts';
import { todosClient } from '@/shared-features/todos/todosClient.ts';
import { todosKeys } from '@/shared-features/todos/todosKeys.ts';

export function useTodoStatsQuery() {
  return useQuery({ queryKey: todosKeys.stats(), queryFn: todosClient.stats, ...QUERY_CACHE.live });
}
