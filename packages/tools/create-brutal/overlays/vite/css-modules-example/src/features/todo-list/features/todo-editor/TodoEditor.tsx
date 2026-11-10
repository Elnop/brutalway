import { useId } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { TitleError } from '@/features/todo-list/shared/presenters/TitleError.tsx';
import { TitleInput } from '@/features/todo-list/shared/presenters/TitleInput.tsx';
import { useTitleForm } from '@/features/todo-list/shared/useTitleForm.ts';
import styles from '@/features/todo-list/features/todo-editor/TodoEditor.module.css';

type TodoEditorProps = {
  title: string;
  onSave: (title: string) => void;
  onCancel: () => void;
};

function cancelOnEscape(onCancel: () => void) {
  return (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') onCancel();
  };
}

type TodoEditorActionsProps = {
  onCancel: () => void;
};

function TodoEditorActions({ onCancel }: TodoEditorActionsProps) {
  const { t } = useTranslation('todoList');

  return (
    <>
      <button type="submit" className="button button-small button-blue">
        {t('save')}
      </button>
      <button type="button" className="button button-small" onClick={onCancel}>
        {t('cancel')}
      </button>
    </>
  );
}

export function TodoEditor({ title, onSave, onCancel }: TodoEditorProps) {
  const { t } = useTranslation('todoList');
  const id = useId();
  const form = useTitleForm({ initialTitle: title, clearOnSubmit: false, onSubmit: onSave });

  return (
    <form className={styles.editor} onSubmit={form.submit}>
      <TitleInput
        id={id}
        label={t('rename', { title })}
        error={form.error}
        autoFocus
        {...form.field}
        onKeyDown={cancelOnEscape(onCancel)}
      />
      <TodoEditorActions onCancel={onCancel} />
      <TitleError id={id} error={form.error} />
    </form>
  );
}
