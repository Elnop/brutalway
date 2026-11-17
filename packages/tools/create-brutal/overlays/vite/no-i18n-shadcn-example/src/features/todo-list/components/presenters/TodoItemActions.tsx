import { Button } from '@third-party/shadcn/button';
import type { Todo } from '@/shared/todos/TodosTypes.ts';

type TodoItemActionsProps = {
  todo: Todo;
  onEdit: () => void;
  onRemove: (id: Todo['id']) => void;
};

export function TodoItemActions({ todo, onEdit, onRemove }: TodoItemActionsProps) {
  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        aria-label={`Edit ${todo.title}`}
        onClick={onEdit}
      >
        Edit
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        aria-label={`Delete ${todo.title}`}
        onClick={() => onRemove(todo.id)}
      >
        Delete
      </Button>
    </>
  );
}
