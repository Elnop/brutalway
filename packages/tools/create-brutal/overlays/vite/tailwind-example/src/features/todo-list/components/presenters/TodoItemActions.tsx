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
        className="button bg-paper px-[0.7rem] py-[0.3rem] text-[0.9rem] text-ink"
        aria-label={t('editTask', { title: todo.title })}
        onClick={onEdit}
      >
        {t('edit')}
      </button>
      <button
        type="button"
        className="button bg-pink px-[0.7rem] py-[0.3rem] text-[0.9rem] text-on-accent"
        aria-label={t('deleteTask', { title: todo.title })}
        onClick={() => onRemove(todo.id)}
      >
        {t('delete')}
      </button>
    </>
  );
}
