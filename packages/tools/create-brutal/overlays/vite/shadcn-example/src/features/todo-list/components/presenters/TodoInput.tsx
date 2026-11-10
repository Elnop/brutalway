import { useTranslation } from 'react-i18next';
import { Button } from '@third-party/shadcn/button';
import { TitleError } from '@/features/todo-list/shared/presenters/TitleError.tsx';
import { TitleInput } from '@/features/todo-list/shared/presenters/TitleInput.tsx';
import { useTitleForm } from '@/features/todo-list/shared/useTitleForm.ts';

type TodoInputProps = {
  onAdd: (title: string) => void;
};

export function TodoInput({ onAdd }: TodoInputProps) {
  const { t } = useTranslation('todoList');
  const { field, error, submit } = useTitleForm({ initialTitle: '', clearOnSubmit: true, onSubmit: onAdd });

  return (
    <form className="mb-5 flex flex-wrap gap-3" onSubmit={submit}>
      <TitleInput id="new-todo" className="h-auto flex-1 bg-paper py-[0.55rem] text-base text-ink" label={t('newTask')} error={error} placeholder={t('placeholder')} autoComplete="off" {...field} />
      <Button type="submit" className="h-auto">
        {t('add')}
      </Button>
      <TitleError id="new-todo" error={error} />
    </form>
  );
}
