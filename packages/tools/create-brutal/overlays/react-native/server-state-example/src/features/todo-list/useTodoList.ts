import { useQuery } from '@tanstack/react-query';
import { useStore } from 'zustand';
import { todosActions, todosStore } from '@/features/todo-list/todosStore.ts';
import { todosClient } from '@/shared/todos/todosClient.ts';
import { todosKeys } from '@/shared/todos/todosKeys.ts';
import { useTodoMutations } from '@/shared/todos/useTodoMutations.ts';
import type { Todo } from '@/shared/todos/TodosTypes.ts';

const NO_TODOS: Todo[] = [];

export function useTodoList() {
  const filter = useStore(todosStore, (state) => state.filter);
  const todos =
    useQuery({
      queryKey: todosKeys.list(filter),
      queryFn: async () => todosClient.list(filter),
    }).data ?? NO_TODOS;
  const { add, update, remove } = useTodoMutations();

  function toggle(id: Todo['id']) {
    const todo = todos.find((candidate) => candidate.id === id);
    if (todo !== undefined) update({ id, patch: { completed: !todo.completed } });
  }

  function rename(id: Todo['id'], title: string) {
    update({ id, patch: { title } });
  }

  return { todos, filter, add, setFilter: todosActions.setFilter, toggle, rename, remove };
}
