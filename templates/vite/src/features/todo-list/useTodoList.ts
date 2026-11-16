import { useMemo } from 'react';
import { selectVisibleTodos } from '@/shared/todos/lib/todosSelectors.ts';
import { todosActions } from '@/shared/todos/todosStore.ts';
import { useTodos } from '@/shared/todos/useTodos.ts';

export function useTodoList() {
  const allTodos = useTodos((state) => state.todos);
  const filter = useTodos((state) => state.filter);
  const todos = useMemo(() => selectVisibleTodos({ todos: allTodos, filter }), [allTodos, filter]);
  return {
    todos,
    filter,
    add: todosActions.add,
    setFilter: todosActions.setFilter,
    toggle: todosActions.toggle,
    rename: todosActions.rename,
    remove: todosActions.remove,
  };
}
