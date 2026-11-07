import { useId } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useTitleForm } from '@/features/todo-list/shared/useTitleForm.ts';
import styles from '@/features/todo-list/features/todo-editor/TodoEditor.module.css';

type TodoEditorProps = {
  title: string;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export function TodoEditor({ title, onSave, onCancel }: TodoEditorProps) {
  const { t } = useTranslation('todoList');
  const id = useId();
  const errorId = `${id}-error`;
  const { field, error, submit } = useTitleForm({ initialTitle: title, clearOnSubmit: false, onSubmit: onSave });

  function cancelOnEscape(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') onCancel();
  }

  return (
    <form className={styles.editor} onSubmit={submit}>
      <label htmlFor={id} className="visually-hidden">
        {t('rename', { title })}
      </label>
      <input id={id} autoFocus aria-invalid={error !== undefined} aria-describedby={error === undefined ? undefined : errorId} {...field} onKeyDown={cancelOnEscape} />
      <button type="submit" className="button button-small button-blue">
        {t('save')}
      </button>
      <button type="button" className="button button-small" onClick={onCancel}>
        {t('cancel')}
      </button>
      {error === undefined ? null : (
        <p id={errorId} role="alert" className="field-error">
          {error}
        </p>
      )}
    </form>
  );
}
