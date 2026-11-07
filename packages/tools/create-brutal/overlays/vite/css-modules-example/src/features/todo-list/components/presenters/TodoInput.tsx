import { useTranslation } from 'react-i18next';
import { useTitleForm } from '@/features/todo-list/shared/useTitleForm.ts';
import styles from '@/features/todo-list/components/presenters/TodoInput.module.css';

type TodoInputProps = {
  onAdd: (title: string) => void;
};

export function TodoInput({ onAdd }: TodoInputProps) {
  const { t } = useTranslation('todoList');
  const { field, error, submit } = useTitleForm({ initialTitle: '', clearOnSubmit: true, onSubmit: onAdd });

  return (
    <form className={styles.form} onSubmit={submit}>
      <label htmlFor="new-todo" className="visually-hidden">
        {t('newTask')}
      </label>
      <input id="new-todo" placeholder={t('placeholder')} autoComplete="off" aria-invalid={error !== undefined} aria-describedby={error === undefined ? undefined : 'new-todo-error'} {...field} />
      <button type="submit" className="button button-yellow">
        {t('add')}
      </button>
      {error === undefined ? null : (
        <p id="new-todo-error" role="alert" className="field-error">
          {error}
        </p>
      )}
    </form>
  );
}
