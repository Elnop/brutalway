import type { TodoFilter } from '@/shared/todos/TodosTypes.ts';

const ALL = ['todos'] as const;
const LISTS = [...ALL, 'list'] as const;

export const todosKeys = {
  all: ALL,
  lists: () => LISTS,
  list: (filter: TodoFilter) => [...LISTS, filter] as const,
  stats: () => [...ALL, 'stats'] as const,
};
