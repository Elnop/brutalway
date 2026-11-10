import { useTranslation } from 'react-i18next';
import { Button } from '@third-party/shadcn/button';

type TodoItemActionsProps = {
  title: string;
  onEdit: () => void;
  onRemove: () => void;
};

export function TodoItemActions({ title, onEdit, onRemove }: TodoItemActionsProps) {
  const { t } = useTranslation('todoList');

  return (
    <>
      <Button type="button" variant="secondary" size="sm" aria-label={t('editTask', { title })} onClick={onEdit}>
        {t('edit')}
      </Button>
      <Button type="button" variant="destructive" size="sm" aria-label={t('deleteTask', { title })} onClick={onRemove}>
        {t('delete')}
      </Button>
    </>
  );
}
