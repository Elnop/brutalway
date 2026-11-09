import { useTranslation } from 'react-i18next';
import { useTitleForm } from '@/features/todo-list/shared/useTitleForm.ts';

type TodoInputProps = {
  onAdd: (title: string) => void;
};

export function TodoInput({ onAdd }: TodoInputProps) {
  const { t } = useTranslation('todoList');
  const { field, error, submit } = useTitleForm({ initialTitle: '', clearOnSubmit: true, onSubmit: onAdd });

  return (
    <form className="mb-5 flex flex-wrap gap-3" onSubmit={submit}>
      <label htmlFor="new-todo" className="sr-only">
        {t('newTask')}
      </label>
      <input
        id="new-todo"
        className="min-w-0 flex-1 border-3 border-ink bg-paper px-3 py-[0.55rem] text-ink"
        placeholder={t('placeholder')}
        autoComplete="off"
        aria-invalid={error !== undefined}
        aria-describedby={error === undefined ? undefined : 'new-todo-error'}
        {...field}
      />
      <button type="submit" className="button bg-yellow px-[1.1rem] py-[0.55rem] text-on-accent">
        {t('add')}
      </button>
      {error === undefined ? null : (
        <p id="new-todo-error" role="alert" className="basis-full border-3 border-ink bg-pink px-[0.6rem] py-[0.2rem] font-bold text-on-accent">
          {error}
        </p>
      )}
    </form>
  );
}
