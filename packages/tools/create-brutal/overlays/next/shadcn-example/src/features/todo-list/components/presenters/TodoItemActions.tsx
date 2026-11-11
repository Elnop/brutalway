import { useTranslation } from 'react-i18next';
import { Button } from '@third-party/shadcn/button';
import type { Todo } from '@/shared-features/todos/TodosTypes.ts';

type TodoItemActionsProps = {
  todo: Todo;
  onEdit: () => void;
  onRemove: (id: Todo['id']) => void;
};

export function TodoItemActions({ todo, onEdit, onRemove }: TodoItemActionsProps) {
  const { t } = useTranslation('todoList');

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        aria-label={t('editTask', { title: todo.title })}
        onClick={onEdit}
      >
        {t('edit')}
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        aria-label={t('deleteTask', { title: todo.title })}
        onClick={() => onRemove(todo.id)}
      >
        {t('delete')}
      </Button>
    </>
  );
}
