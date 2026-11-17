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
        className="button bg-paper px-[0.7rem] py-[0.3rem] text-[0.9rem] text-ink"
        aria-label={`Edit ${todo.title}`}
        onClick={onEdit}
      >
        Edit
      </button>
      <button
        type="button"
        className="button bg-pink px-[0.7rem] py-[0.3rem] text-[0.9rem] text-on-accent"
        aria-label={`Delete ${todo.title}`}
        onClick={() => onRemove(todo.id)}
      >
        Delete
      </button>
    </>
  );
}
