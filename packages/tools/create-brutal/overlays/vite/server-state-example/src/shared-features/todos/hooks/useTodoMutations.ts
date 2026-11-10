import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todosClient } from '@/shared-features/todos/todosClient.ts';
import { todosKeys } from '@/shared-features/todos/todosKeys.ts';
import type { Todo, TodoUpdate } from '@/shared-features/todos/TodosTypes.ts';

export function useTodoMutations() {
  const queryClient = useQueryClient();
  const refresh = {
    onSettled: async () => queryClient.invalidateQueries({ queryKey: todosKeys.all }),
  };

  async function showUpdate({ id, patch }: TodoUpdate) {
    await queryClient.cancelQueries({ queryKey: todosKeys.lists() });
    queryClient.setQueriesData<Todo[]>({ queryKey: todosKeys.lists() }, (todos) =>
      todos?.map((todo) => (todo.id === id ? { ...todo, ...patch } : todo)),
    );
  }

  return {
    add: useMutation({ mutationFn: todosClient.create, ...refresh }).mutate,
    update: useMutation({ mutationFn: todosClient.update, onMutate: showUpdate, ...refresh })
      .mutate,
    remove: useMutation({ mutationFn: todosClient.remove, ...refresh }).mutate,
    clearCompleted: useMutation({ mutationFn: todosClient.clearCompleted, ...refresh }).mutate,
  };
}
