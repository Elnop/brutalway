import { useId } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { TitleError } from '@/features/todo-list/shared/presenters/TitleError.tsx';
import { TitleInput } from '@/features/todo-list/shared/presenters/TitleInput.tsx';
import { useTitleForm } from '@/features/todo-list/shared/useTitleForm.ts';

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

export function TodoEditor({ title, onSave, onCancel }: TodoEditorProps) {
  const { t } = useTranslation('todoList');
  const id = useId();
  const { field, error, submit } = useTitleForm({ initialTitle: title, clearOnSubmit: false, onSubmit: onSave });

  return (
    <form className="todo-editor" onSubmit={submit}>
      <TitleInput id={id} label={t('rename', { title })} error={error} autoFocus {...field} onKeyDown={cancelOnEscape(onCancel)} />
      <button type="submit" className="button button-small button-blue">
        {t('save')}
      </button>
      <button type="button" className="button button-small" onClick={onCancel}>
        {t('cancel')}
      </button>
      <TitleError id={id} error={error} />
    </form>
  );
}
