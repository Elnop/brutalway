import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import { normalizeTitle } from '@/shared/normalizeTitle.ts';
import { STARTER_TODOS } from '@/shared-features/todos/TodosConfig.ts';
import type { TodosActions, TodosState } from '@/shared-features/todos/TodosTypes.ts';

export const todosStore = createStore<TodosState>()(
  persist((): TodosState => ({ todos: STARTER_TODOS, filter: 'all' }), {
    name: 'todos',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({ todos: state.todos }),
  }),
);

export const todosActions: TodosActions = {
  add: (title) => {
    const normalized = normalizeTitle(title);
    if (normalized === '') return;
    todosStore.setState((state) => ({
      todos: [...state.todos, { id: randomUUID(), title: normalized, completed: false }],
    }));
  },
  toggle: (id) =>
    todosStore.setState((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    })),
  rename: (id, title) => {
    const normalized = normalizeTitle(title);
    if (normalized === '') return;
    todosStore.setState((state) => ({
      todos: state.todos.map((todo) => (todo.id === id ? { ...todo, title: normalized } : todo)),
    }));
  },
  remove: (id) =>
    todosStore.setState((state) => ({ todos: state.todos.filter((todo) => todo.id !== id) })),
  clearCompleted: () =>
    todosStore.setState((state) => ({ todos: state.todos.filter((todo) => !todo.completed) })),
  setFilter: (filter) => todosStore.setState({ filter }),
};
