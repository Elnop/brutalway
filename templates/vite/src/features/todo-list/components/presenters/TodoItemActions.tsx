import { useTranslation } from 'react-i18next';

type TodoItemActionsProps = {
  title: string;
  onEdit: () => void;
  onRemove: () => void;
};

export function TodoItemActions({ title, onEdit, onRemove }: TodoItemActionsProps) {
  const { t } = useTranslation('todoList');

  return (
    <>
      <button type="button" className="button button-small" aria-label={t('editTask', { title })} onClick={onEdit}>
        {t('edit')}
      </button>
      <button type="button" className="button button-small button-pink" aria-label={t('deleteTask', { title })} onClick={onRemove}>
        {t('delete')}
      </button>
    </>
  );
}
