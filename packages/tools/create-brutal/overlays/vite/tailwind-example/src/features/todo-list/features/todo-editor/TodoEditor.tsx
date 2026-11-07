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
    <form className="flex min-w-0 flex-[1_1_100%] flex-wrap gap-2" onSubmit={submit}>
      <label htmlFor={id} className="sr-only">
        {`Rename ${title}`}
      </label>
      <input
        id={id}
        className="min-w-0 flex-[1_1_10rem] border-3 border-ink bg-paper px-3 py-[0.55rem]"
        autoFocus
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={cancelOnEscape}
      />
      <button type="submit" className="button bg-blue px-[0.7rem] py-[0.3rem] text-[0.9rem] text-paper" disabled={blank}>
        Save
      </button>
      <button type="button" className="button bg-paper px-[0.7rem] py-[0.3rem] text-[0.9rem]" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}
