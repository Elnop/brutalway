import { randomUUID } from 'expo-crypto';
import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import { normalizeTitle } from '@/shared/todos/lib/normalizeTitle.ts';
import { STARTER_TODOS } from '@/shared/todos/TodosConfig.ts';
import { todosStorage } from '@/shared/todos/lib/todosStorage.ts';
import type { TodosActions, TodosState } from '@/shared/todos/TodosTypes.ts';

export const todosStore = createStore<TodosState>()(
  persist((): TodosState => ({ todos: STARTER_TODOS, filter: 'all' }), {
    name: 'todos',
    storage: todosStorage(),
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
