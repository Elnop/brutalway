import { useTranslation } from 'react-i18next';
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
      <button
        type="button"
        className="button button-small"
        aria-label={t('editTask', { title: todo.title })}
        onClick={onEdit}
      >
        {t('edit')}
      </button>
      <button
        type="button"
        className="button button-small button-pink"
        aria-label={t('deleteTask', { title: todo.title })}
        onClick={() => onRemove(todo.id)}
      >
        {t('delete')}
      </button>
    </>
  );
}
