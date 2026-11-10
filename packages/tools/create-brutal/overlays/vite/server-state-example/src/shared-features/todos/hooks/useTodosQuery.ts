import { useQuery } from '@tanstack/react-query';
import { todosClient } from '@/shared-features/todos/todosClient.ts';
import { todosKeys } from '@/shared-features/todos/todosKeys.ts';
import type { TodoFilter } from '@/shared-features/todos/TodosTypes.ts';

export function useTodosQuery(filter: TodoFilter) {
  return useQuery({
    queryKey: todosKeys.list(filter),
    queryFn: async () => todosClient.list(filter),
  });
}
