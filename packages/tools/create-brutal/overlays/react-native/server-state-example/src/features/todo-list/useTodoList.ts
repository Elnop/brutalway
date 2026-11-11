import { useTodoMutations } from '@/shared-features/todos/hooks/useTodoMutations.ts';
import { useTodos } from '@/shared-features/todos/hooks/useTodos.ts';
import { useTodosQuery } from '@/shared-features/todos/hooks/useTodosQuery.ts';
import { todosActions } from '@/shared-features/todos/todosStore.ts';
import type { Todo } from '@/shared-features/todos/TodosTypes.ts';

const NO_TODOS: Todo[] = [];

export function useTodoList() {
  const filter = useTodos((state) => state.filter);
  const todos = useTodosQuery(filter).data ?? NO_TODOS;
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
