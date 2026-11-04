import { useId, useState } from 'react';
import type { KeyboardEvent, SubmitEvent } from 'react';
import { normalizeTitle } from '@/shared/lib/normalizeTitle.ts';

type TodoEditorProps = {
  title: string;
  onSave: (title: string) => void;
  onCancel: () => void;
};

export function TodoEditor({ title, onSave, onCancel }: TodoEditorProps) {
  const id = useId();
  const [draft, setDraft] = useState(title);
  const blank = normalizeTitle(draft) === '';

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!blank) onSave(draft);
  }

  function cancelOnEscape(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') onCancel();
  }

  return (
    <form className="todo-editor" onSubmit={submit}>
      <label htmlFor={id} className="visually-hidden">
        {`Rename ${title}`}
      </label>
      <input id={id} autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={cancelOnEscape} />
      <button type="submit" className="button button-small button-blue" disabled={blank}>
        Save
      </button>
      <button type="button" className="button button-small" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}
