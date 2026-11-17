import { TitleError } from '@/features/todo-list/shared/title-error/TitleError.tsx';
import { TitleInput } from '@/features/todo-list/shared/title-input/TitleInput.tsx';
import { useTitleForm } from '@/features/todo-list/shared/title-form/useTitleForm.ts';

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
    <form className="mb-5 flex flex-wrap gap-3" onSubmit={submit}>
      <TitleInput
        id="new-todo"
        className="min-w-0 flex-1 border-3 border-ink bg-paper px-3 py-[0.55rem] text-ink"
        label="New task"
        error={error}
        placeholder="What needs doing?"
        autoComplete="off"
        {...field}
      />
      <button type="submit" className="button bg-yellow px-[1.1rem] py-[0.55rem] text-on-accent">
        Add
      </button>
      <TitleError id="new-todo" error={error} />
    </form>
  );
}
