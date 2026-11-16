import { useStore } from 'zustand';
import { todosStore } from '@/shared/todos/todosStore.ts';
import type { TodosState } from '@/shared/todos/TodosTypes.ts';

export function useTodos<T>(selector: (state: TodosState) => T): T {
  return useStore(todosStore, selector);
}
