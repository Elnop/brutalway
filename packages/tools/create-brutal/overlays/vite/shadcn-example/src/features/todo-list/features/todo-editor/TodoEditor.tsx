import { useId } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@third-party/shadcn/button';
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
        className="h-auto flex-[1_1_10rem] bg-paper py-[0.55rem] text-base text-ink"
        label={t('rename', { title })}
        error={error}
        autoFocus
        {...field}
        onKeyDown={cancelOnEscape(onCancel)}
      />
      <Button type="submit" size="sm">
        {t('save')}
      </Button>
      <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
        {t('cancel')}
      </Button>
      <TitleError id={id} error={error} />
    </form>
  );
}
