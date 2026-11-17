import { TitleError } from '@/features/todo-list/shared/title-error/TitleError.tsx';
import { TitleInput } from '@/features/todo-list/shared/title-input/TitleInput.tsx';
import { useTitleForm } from '@/features/todo-list/shared/title-form/useTitleForm.ts';
import styles from '@/features/todo-list/components/presenters/TodoInput.module.css';

type TodoInputProps = {
  onAdd: (title: string) => void;
};

export function TodoInput({ onAdd }: TodoInputProps) {
  const { field, error, submit } = useTitleForm({
    initialTitle: '',
    clearOnSubmit: true,
    onSubmit: onAdd,
  });

  return (
    <form className={styles.form} onSubmit={submit}>
      <TitleInput
        id="new-todo"
        label="New task"
        error={error}
        placeholder="What needs doing?"
        autoComplete="off"
        {...field}
      />
      <button type="submit" className="button button-yellow">
        Add
      </button>
      <TitleError id="new-todo" error={error} />
    </form>
  );
}
