import { Button } from '@/shared/theme/Button.tsx';
import type { Todo } from '@/shared/todos/TodosTypes.ts';

type TodoItemActionsProps = {
  todo: Todo;
  onEdit: () => void;
  onRemove: (id: Todo['id']) => void;
};

export function TodoItemActions({ todo, onEdit, onRemove }: TodoItemActionsProps) {
  return (
    <>
      <Button label="Edit" small aria-label={`Edit ${todo.title}`} onPress={onEdit} />
      <Button
        label="Delete"
        tone="pink"
        small
        aria-label={`Delete ${todo.title}`}
        onPress={() => onRemove(todo.id)}
      />
    </>
  );
}
