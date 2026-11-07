import { useStore } from 'zustand';
import { todosStore } from '@/shared-features/todos/todosStore.ts';
import type { TodosState } from '@/shared-features/todos/TodosTypes.ts';

export function useTodos<T>(selector: (state: TodosState) => T): T {
  return useStore(todosStore, selector);
}
