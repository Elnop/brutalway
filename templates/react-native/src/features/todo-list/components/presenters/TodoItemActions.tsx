import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/theme/Button.tsx';
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
        label={t('edit')}
        small
        aria-label={t('editTask', { title: todo.title })}
        onPress={onEdit}
      />
      <Button
        label={t('delete')}
        tone="pink"
        small
        aria-label={t('deleteTask', { title: todo.title })}
        onPress={() => onRemove(todo.id)}
      />
    </>
  );
}
