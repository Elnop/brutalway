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
      <button type="button" className="button bg-paper px-[0.7rem] py-[0.3rem] text-[0.9rem] text-ink" aria-label={t('editTask', { title })} onClick={onEdit}>
        {t('edit')}
      </button>
      <button type="button" className="button bg-pink px-[0.7rem] py-[0.3rem] text-[0.9rem] text-on-accent" aria-label={t('deleteTask', { title })} onClick={onRemove}>
        {t('delete')}
      </button>
    </>
  );
}
