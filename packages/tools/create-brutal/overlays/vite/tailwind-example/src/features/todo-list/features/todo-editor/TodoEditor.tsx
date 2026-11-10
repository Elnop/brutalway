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
    <form className="flex min-w-0 flex-[1_1_100%] flex-wrap gap-2" onSubmit={submit}>
      <TitleInput
        id={id}
        className="min-w-0 flex-[1_1_10rem] border-3 border-ink bg-paper px-3 py-[0.55rem] text-ink"
        label={t('rename', { title })}
        error={error}
        autoFocus
        {...field}
        onKeyDown={cancelOnEscape(onCancel)}
      />
      <button type="submit" className="button bg-blue px-[0.7rem] py-[0.3rem] text-[0.9rem] text-on-accent">
        {t('save')}
      </button>
      <button type="button" className="button bg-paper px-[0.7rem] py-[0.3rem] text-[0.9rem] text-ink" onClick={onCancel}>
        {t('cancel')}
      </button>
      <TitleError id={id} error={error} />
    </form>
  );
}
