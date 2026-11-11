import { createStore } from 'zustand/vanilla';
import type { TodosActions, TodosState } from '@/shared-features/todos/TodosTypes.ts';

export const todosStore = createStore<TodosState>()(() => ({ filter: 'all' }));

export const todosActions: TodosActions = {
  setFilter: (filter) => todosStore.setState({ filter }),
};
