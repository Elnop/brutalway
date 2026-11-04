import type { Todo, TodosState } from '@/shared-features/todos/TodosTypes.ts';

export function selectVisibleTodos(state: TodosState): Todo[] {
  if (state.filter === 'active') return state.todos.filter((todo) => !todo.completed);
  if (state.filter === 'completed') return state.todos.filter((todo) => todo.completed);
  return state.todos;
}

export function selectRemainingCount(state: TodosState): number {
  return state.todos.filter((todo) => !todo.completed).length;
}

export function selectCompletedCount(state: TodosState): number {
  return state.todos.filter((todo) => todo.completed).length;
}
