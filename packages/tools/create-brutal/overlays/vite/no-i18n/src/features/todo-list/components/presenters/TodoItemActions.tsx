import type { Todo } from '@/shared/todos/TodosTypes.ts';

type TodoItemActionsProps = {
  todo: Todo;
  onEdit: () => void;
  onRemove: (id: Todo['id']) => void;
};

export function TodoItemActions({ todo, onEdit, onRemove }: TodoItemActionsProps) {
  return (
    <>
      <button
        type="button"
        className="button button-small"
        aria-label={`Edit ${todo.title}`}
        onClick={onEdit}
      >
        Edit
      </button>
      <button
        type="button"
        className="button button-small button-pink"
        aria-label={`Delete ${todo.title}`}
        onClick={() => onRemove(todo.id)}
      >
        Delete
      </button>
    </>
  );
}
