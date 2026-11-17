import { useId } from 'react';
import type { KeyboardEvent } from 'react';
import { TitleError } from '@/features/todo-list/shared/title-error/TitleError.tsx';
import { TitleInput } from '@/features/todo-list/shared/title-input/TitleInput.tsx';
import { useTitleForm } from '@/features/todo-list/shared/title-form/useTitleForm.ts';

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
  return (
    <>
      <button
        type="submit"
        className="button bg-blue px-[0.7rem] py-[0.3rem] text-[0.9rem] text-on-accent"
      >
        Save
      </button>
      <button
        type="button"
        className="button bg-paper px-[0.7rem] py-[0.3rem] text-[0.9rem] text-ink"
        onClick={onCancel}
      >
        Cancel
      </button>
    </>
  );
}

export function TodoEditor({ title, onSave, onCancel }: TodoEditorProps) {
  const id = useId();
  const form = useTitleForm({ initialTitle: title, clearOnSubmit: false, onSubmit: onSave });

  return (
    <form className="flex min-w-0 flex-[1_1_100%] flex-wrap gap-2" onSubmit={form.submit}>
      <TitleInput
        id={id}
        className="min-w-0 flex-[1_1_10rem] border-3 border-ink bg-paper px-3 py-[0.55rem] text-ink"
        label={`Rename ${title}`}
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
