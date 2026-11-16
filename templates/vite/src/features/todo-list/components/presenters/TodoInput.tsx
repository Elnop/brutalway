import { useTranslation } from 'react-i18next';
import { TitleError } from '@/features/todo-list/shared/title-error/TitleError.tsx';
import { TitleInput } from '@/features/todo-list/shared/title-input/TitleInput.tsx';
import { useTitleForm } from '@/features/todo-list/shared/title-form/useTitleForm.ts';

type TodoInputProps = {
  onAdd: (title: string) => void;
};

export function TodoInput({ onAdd }: TodoInputProps) {
  const { t } = useTranslation('todoList');
  const { field, error, submit } = useTitleForm({
    initialTitle: '',
    clearOnSubmit: true,
    onSubmit: onAdd,
  });

  return (
    <form className="todo-input" onSubmit={submit}>
      <TitleInput
        id="new-todo"
        label={t('newTask')}
        error={error}
        placeholder={t('placeholder')}
        autoComplete="off"
        {...field}
      />
      <button type="submit" className="button button-yellow">
        {t('add')}
      </button>
      <TitleError id="new-todo" error={error} />
    </form>
  );
}
