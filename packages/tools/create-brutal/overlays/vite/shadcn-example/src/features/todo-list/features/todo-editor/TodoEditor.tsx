import { useId } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@third-party/shadcn/button';
import { Input } from '@third-party/shadcn/input';
import { useTitleForm } from '@/features/todo-list/shared/useTitleForm.ts';

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
    <form className="flex min-w-0 flex-[1_1_100%] flex-wrap gap-2" onSubmit={submit}>
      <label htmlFor={id} className="sr-only">
        {t('rename', { title })}
      </label>
      <Input
        id={id}
        className="h-auto flex-[1_1_10rem] bg-paper py-[0.55rem] text-base text-ink"
        autoFocus
        aria-invalid={error !== undefined}
        aria-describedby={error === undefined ? undefined : errorId}
        {...field}
        onKeyDown={cancelOnEscape}
      />
      <Button type="submit" size="sm">
        {t('save')}
      </Button>
      <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
        {t('cancel')}
      </Button>
      {error === undefined ? null : (
        <p id={errorId} role="alert" className="basis-full border-3 border-ink bg-pink px-[0.6rem] py-[0.2rem] font-bold text-on-accent">
          {error}
        </p>
      )}
    </form>
  );
}
