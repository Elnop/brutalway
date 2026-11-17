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
      <button type="submit" className="button button-small button-blue">
        Save
      </button>
      <button type="button" className="button button-small" onClick={onCancel}>
        Cancel
      </button>
    </>
  );
}

export function TodoEditor({ title, onSave, onCancel }: TodoEditorProps) {
  const id = useId();
  const form = useTitleForm({ initialTitle: title, clearOnSubmit: false, onSubmit: onSave });

  return (
    <form className="todo-editor" onSubmit={form.submit}>
      <TitleInput
        id={id}
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
