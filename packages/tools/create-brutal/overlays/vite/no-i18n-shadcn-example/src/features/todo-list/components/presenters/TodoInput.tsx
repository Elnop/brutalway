import { Button } from '@third-party/shadcn/button';
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
        className="h-auto flex-1 bg-paper py-[0.55rem] text-base text-ink"
        label="New task"
        error={error}
        placeholder="What needs doing?"
        autoComplete="off"
        {...field}
      />
      <Button type="submit" className="h-auto">
        Add
      </Button>
      <TitleError id="new-todo" error={error} />
    </form>
  );
}
