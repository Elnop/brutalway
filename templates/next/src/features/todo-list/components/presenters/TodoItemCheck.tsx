import type { Todo } from '@/shared-features/todos/TodosTypes.ts';

type TodoItemCheckProps = {
  todo: Todo;
  onToggle: (id: Todo['id']) => void;
};

export function TodoItemCheck({ todo, onToggle }: TodoItemCheckProps) {
  return (
    <label className="todo-item-check">
      <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
      <span>{todo.title}</span>
    </label>
  );
}
