import { useId } from 'react';
import type { KeyboardEvent } from 'react';
import { useTitleForm } from '@/features/todo-list/shared/useTitleForm.ts';

type TodoEditorProps = {
  title: string;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export function TodoEditor({ title, onSave, onCancel }: TodoEditorProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const { field, error, submit } = useTitleForm({ initialTitle: title, clearOnSubmit: false, onSubmit: onSave });

  function cancelOnEscape(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') onCancel();
  }

  return (
    <form className="todo-editor" onSubmit={submit}>
      <label htmlFor={id} className="visually-hidden">
        {`Rename ${title}`}
      </label>
      <input id={id} autoFocus aria-invalid={error !== undefined} aria-describedby={error === undefined ? undefined : errorId} {...field} onKeyDown={cancelOnEscape} />
      <button type="submit" className="button button-small button-blue">
        Save
      </button>
      <button type="button" className="button button-small" onClick={onCancel}>
        Cancel
      </button>
      {error === undefined ? null : (
        <p id={errorId} role="alert" className="field-error">
          {error}
        </p>
      )}
    </form>
  );
}
