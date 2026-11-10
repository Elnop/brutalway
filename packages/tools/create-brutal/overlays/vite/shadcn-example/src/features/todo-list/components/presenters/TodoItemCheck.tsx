import { Checkbox } from '@third-party/shadcn/checkbox';
import type { Todo } from '@/shared-features/todos/TodosTypes.ts';

type TodoItemCheckProps = {
  todo: Todo;
  onToggle: (id: Todo['id']) => void;
};

export function TodoItemCheck({ todo, onToggle }: TodoItemCheckProps) {
  return (
    <label className="flex min-w-40 flex-1 cursor-pointer items-center gap-3 font-bold">
      <Checkbox
        className="size-6 rounded-none"
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
      />
      <span className={todo.completed ? 'line-through decoration-3' : undefined}>{todo.title}</span>
    </label>
  );
}
